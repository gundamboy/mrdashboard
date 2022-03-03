import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import scholarshipsActions from './actions';
import {db, rsf, storageRef} from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import {SCHOLARSHIP_API_PATH} from "../../helpers/shared";

function getScholarshipTestRef(documentId, currentYear) {
    return db.collection("scholarshipsTestCollection").doc(currentYear).collection("applications").doc(documentId);
}

function getScholarshipRef (documentId, currentYear) {
    return db.collection("scholarships").doc(currentYear.scholarshipYear).collection("applications").doc(documentId);
}

function getApplicationsRef (scholarshipYear) {
    return db.collection("scholarships").doc(scholarshipYear.scholarshipYear).collection("applications");
}

function get2020ApplicationsRef () {
    return db.collection("scholarships").doc("2020").collection("applications");
}
function* initScholarships(scholarshipYear) {
    try {

        const collectionRef = getApplicationsRef(scholarshipYear);
        const usersRef = db.collection("users");
        const snapshots = yield call(rsf.firestore.getCollection, collectionRef);
        const userSnapshots = yield call(rsf.firestore.getCollection, usersRef);
        const scholarships = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const users = userSnapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        // only uncomment this to clone the production table into a testing table
        //cloneScholarshipObjects(scholarships)


        yield put( {
            type: scholarshipsActions.FETCH_SCHOLARSHIPS_SUCCESS,
            payload: scholarships,
            users: users
        });

    } catch (error) {
        console.log("initScholarships error: ", error);
        yield put( {
            type: scholarshipsActions.FETCH_SCHOLARSHIPS_FAILURE,
            data: error
        });
    }
}

function* getSingleScholarship(documentId) {
    try {
        let scholarship = null;

        if(documentId) {
            const collectionRef = getScholarshipRef(documentId.payload);
            const fetchScholarship = yield call(() => {
                return new Promise((resolve, reject) => {
                    collectionRef.get()
                        .then((doc) => {
                            if(doc.exists) {
                                scholarship = doc.data();
                                resolve(fetchScholarship);
                            } else {
                                console.log("DOC DOES NOT EXIST");
                                console.log("Should be forced error");
                                resolve(fetchScholarship);
                            }
                        })
                        .catch(error => {
                            console.log("fetchScholarship error:", error);
                            resolve(fetchScholarship);
                        })
                });
            });

            if(scholarship !== null) {
                yield notifySingleScholarshipFetched(scholarship);
            } else {

            }
        }

    } catch(error) {
        console.log(error);
        yield put({
            type: scholarshipsActions.FETCH_SINGLE_SCHOLARSHIP_FAILURE,
            payload: error
        });
    }
}

function* notifySingleScholarshipFetched(scholarship) {
   try {
       yield put({
           type: scholarshipsActions.FETCH_SINGLE_SCHOLARSHIP_SUCCESS,
           payload: scholarship
       });
   } catch (error) {

   }
}

function* adminSave(payload) {
    try {
        const documentId = payload.documentId;
        const status = payload.approval;
        const appType = payload.appType;
        const grades = payload.grades;
        const notes = payload.notes;
        const purchaseOrderNumber = payload.purchaseOrderNumber;
        const collectionRef = getScholarshipRef(documentId);

        let updated = false;
        let updateDB = {};
        updateDB["".concat("admin", ".", "approvalStatus", ".", appType)] = status;
        updateDB["".concat("admin", ".").concat("grades")] = grades;
        updateDB["".concat("admin", ".").concat("notes")] = notes;
        updateDB["".concat("admin", ".").concat("purchaseOrderNumber")] = purchaseOrderNumber;

        const updateApp = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.update(updateDB)
                    .then(() => {
                        updated = true;
                        resolve(updateApp);
                    })
                    .catch((error) => {
                        console.log("error updating application in firebase:", error);
                        resolve(updateApp);
                    });
            })
        });

        if(updated) {
            yield call(() => notifyAdminSavedFetchSingle(documentId, collectionRef))

        }
    } catch (error) {
        console.log("adminSave error:", error);
    }
}

function* notifyAdminSavedFetchSingle(documentId, collectionRef) {
    try {
        let scholarship = null;

        const fetchScholarship = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.get()
                    .then((doc) => {
                        if (doc.exists) {
                            scholarship = doc.data();
                            resolve(fetchScholarship);
                        } else {
                            console.log("notifyAdminSaved DOC DOES NOT EXIST");
                            resolve(fetchScholarship);
                        }
                    })
                    .catch(error => {
                        console.log("notifyAdminSaved error:", error);
                        resolve(fetchScholarship);
                    })
            });
        });

        if(scholarship) {
            yield put({
                type: scholarshipsActions.UPDATE_SCHOLARSHIP_SUCCESS,
                payload: scholarship
            });
        }

    } catch (error) {

    }
}

// posts data to the php to send an applicant an email
function deployEmail(userEmail, emailArray, name) {
    return axios({
        method: 'post',
        url: SCHOLARSHIP_API_PATH(),
        headers: { 'content-type': 'application/json' },
        data: {
            userEmail: userEmail,
            emailArray: emailArray,
            name: name
        }
    }).catch((error) => {
        console.log("axios error:", error);
    });
}

function* sendEmail(payload) {
    try {
        console.group("%c sendEmail Main", 'background: #BFACAA; color: #222; padding: 5px;');

        const userId = payload.userId;
        const scholarshipType = payload.scholarshipType;

        const { data } = yield call(() => {
            return new Promise((resolve, reject) => {
                const doEmail = deployEmail(payload.userEmail, payload.emailArray, payload.name)
                console.log("doEmail:", doEmail);
                resolve(doEmail);
            })
        });

        if(!data) {
            yield put(scholarshipsActions.scholarshipsEmailError(true, false));
        } else {
            yield put(scholarshipsActions.scholarshipsEmailError(false, false));
            const collectionRef = getScholarshipRef(userId);
            let applicationUpdated = false;
            let applicationFetched = false;
            let firebaseError = false;
            let updatedApp = null;
            if (data.status) {
                const update = yield call(() => {
                    return new Promise((resolve, reject) => {
                        if (scholarshipType === "higherEdu") {
                            collectionRef.update({
                                "admin.applicantNotified.higherEdu": data.status,
                                "admin.approvalDates.higherEdu": data.status ? firebase.firestore.Timestamp.fromDate(new Date()) : "",
                            })
                                .then(() => {
                                    applicationUpdated = true;
                                    resolve(update);
                                })
                                .catch((error) => {
                                    console.log("email: update scholarship error:", error);
                                    firebaseError = true;
                                    resolve(update);
                                })
                        } else {
                            collectionRef.update({
                                "admin.applicantNotified.dcc": data.status,
                                "admin.approvalDates.dcc": data.status ? firebase.firestore.Timestamp.fromDate(new Date()) : "",
                            })
                                .then(() => {
                                    applicationUpdated = true;
                                    resolve(update);
                                })
                                .catch((error) => {
                                    console.log("email: update scholarship error:", error);
                                    firebaseError = true;
                                    resolve(update);
                                })
                        }
                    });
                });
                if (firebaseError) {
                    yield put(scholarshipsActions.scholarshipsEmailError(false, true));
                }
            } else {
                yield put(scholarshipsActions.scholarshipsEmailError(true, false));
            }
            if (applicationUpdated) {
                const fetchScholarship = yield call(() => {
                    return new Promise((resolve, reject) => {
                        collectionRef.get()
                            .then((doc) => {
                                if (doc.exists) {
                                    updatedApp = doc.data();
                                    updatedApp = {
                                        id: userId,
                                        ...updatedApp
                                    }
                                    applicationFetched = true;
                                    resolve(fetchScholarship);
                                } else {
                                    console.log("DOC DOES NOT EXIST");
                                    console.log("Should be forced error");
                                    resolve(fetchScholarship);
                                }
                            })
                            .catch(error => {
                                console.log("fetchScholarship error:", error);
                                resolve(fetchScholarship);
                            })
                    });
                });
                if (updatedApp !== null) {
                    yield notifySingleScholarshipFetched(updatedApp);
                } else {
                }
            }
        }

        console.groupEnd();

    } catch (error) {
        console.log("%c sendEmail SAGA ERROR:" + error, 'color: red');
    }
}

function* scholarshipDelete(payload) {
    try {
        console.log("SAGA: scholarshipDelete");

        let scholarshipAppDeleted = false;
        const ref = getScholarshipRef(payload.documentId);
        const scholarshipFiles = storageRef.ref(payload.documentId);
        const scholarshipDccFiles = storageRef.ref(payload.documentId).child("dcc");
        const scholarshipEduFiles = storageRef.ref(payload.documentId).child("higherEdu");

        const deleteDocument = yield call(() => {
            return new Promise((resolve, reject) => {
                ref.delete()
                    .then(() => {
                        console.log("deleted")
                        scholarshipAppDeleted = true;
                        resolve(deleteDocument);
                    })
                    .catch((error) => {
                        console.log("delete scholarship error:", error);
                    });
            });
        });

        if (scholarshipFiles) {
            const deleteFiles = yield call(() => {
                return new Promise((resolve, reject) => {
                    scholarshipFiles.listAll().then((listResults) => {
                        const promises = listResults.items.map((item) => {
                            return item.delete();
                        })

                        Promise.all(promises).then(() => {
                            resolve(deleteFiles);
                        })

                        console.log("listResults:", listResults.items);
                        resolve(deleteFiles);
                    })

                });
            });
        }

        if (scholarshipDccFiles) {
            const deleteDccFiles = yield call(() => {
                return new Promise((resolve, reject) => {
                    scholarshipDccFiles.listAll().then((listResults) => {
                        const promises = listResults.items.map((item) => {
                            return item.delete();
                        })

                        Promise.all(promises).then(() => {
                            resolve(deleteDccFiles);
                        })
                    })
                });
            });
        }

        if (scholarshipEduFiles) {
            const deleteEduFiles = yield call(() => {
                return new Promise((resolve, reject) => {
                    scholarshipEduFiles.listAll().then((listResults) => {
                        const promises = listResults.items.map((item) => {
                            return item.delete();
                        })

                        Promise.all(promises).then(() => {
                            resolve(deleteEduFiles);
                        })

                    })
                });
            });
        }

        if(scholarshipAppDeleted) {
            yield notifyScholarshipDeleted(payload.documentId);
        }

    } catch (error) {
        console.log("scholarshipDelete error:", error);
    }
}

function* notifyScholarshipDeleted(sponsorshipId) {
    try {
        yield put({
            type: scholarshipsActions.DELETE_SCHOLARSHIP_SUCCESS,
        });


    } catch (error) {
        console.log("notifyScholarshipDeleted error:", error);
    }
}

function* notifyEmailError(errorType) {
    try {
        yield put({
            type: scholarshipsActions.SEND_SCHOLARSHIP_EMAIL_ERROR,
        });
    } catch (error) {
        console.log("notifyScholarshipDeleted error:", error);
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(scholarshipsActions.FETCH_SCHOLARSHIPS_START, initScholarships),
        takeEvery(scholarshipsActions.SET_SCHOLARSHIP_YEAR, initScholarships),
        takeEvery(scholarshipsActions.FETCH_SINGLE_SCHOLARSHIP_START, getSingleScholarship),
        takeEvery(scholarshipsActions.UPDATE_SCHOLARSHIP_START, adminSave),
        takeEvery(scholarshipsActions.SEND_SCHOLARSHIP_EMAIL, sendEmail),
        takeEvery(scholarshipsActions.DELETE_SCHOLARSHIP, scholarshipDelete),
    ]);
}