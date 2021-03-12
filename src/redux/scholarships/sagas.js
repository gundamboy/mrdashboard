import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import scholarshipsActions from './actions';
import {db, rsf, storageRef} from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import {getCurrentYear, SCHOLARSHIP_API_PATH} from "../../helpers/shared";

const currentYear = getCurrentYear().toString();

const getScholarshipTestRef = (documentId) => {
    return db.collection("scholarshipsTestCollection").doc(currentYear).collection("applications").doc(documentId);
}

const getScholarshipRef = (documentId) => {
    return db.collection("scholarships").doc(currentYear).collection("applications").doc(documentId);
}

const getApplicationsRef = () => {
    return db.collection("scholarships").doc(currentYear).collection("applications");
}

function* initScholarships() {
    console.group("SAGA initScholarships");
    try {

        const collectionRef = getApplicationsRef();
        const usersRef = db.collection("users");
        const snapshots = yield call(rsf.firestore.getCollection, collectionRef);
        const userSnapshots = yield call(rsf.firestore.getCollection, usersRef);
        const scholarships = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const users = userSnapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        console.log("scholarships", scholarships);

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

    console.groupEnd();
}

function* getSingleScholarship(documentId) {
    try {
        let scholarship = null;

        if(documentId) {
            const scholarshipRef = getScholarshipRef(documentId.payload);
            const fetchScholarship = yield call(() => {
                return new Promise((resolve, reject) => {
                    scholarshipRef.get()
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

function* updateGrades(payload) {
    try {
        const documentId = payload.documentId;
        const grades = payload.grades;
        const getScholarshipRef = getSingleScholarship(documentId);

        let updateDB = {};
        updateDB["".concat("admin", ".").concat("grades")] = grades;

        const updateGrades = yield call(() => {
           return new Promise((resolve, reject) => {
               getScholarshipRef.update(updateDB)
                   .then(() => {})
                   .catch((error) => {
                   console.log("error updating application in firebase:", error);
               });
               resolve(updateGrades);
           })
        });
    } catch (error) {

    }
}

function* updateNotes(payload) {
    try {
        const documentId = payload.documentId;
        const notes = payload.notes;
        const getScholarshipRef = getSingleScholarship(documentId);

        let updateDB = {};
        updateDB["".concat("admin", ".").concat("notes")] = notes;
        let updated = false;

        const updateNotes = yield call(() => {
            return new Promise((resolve, reject) => {
                getScholarshipRef.update(updateDB)
                    .then(() => {
                        updated = true;
                    })
                    .catch((error) => {
                        console.log("error updating application in firebase:", error);
                    });
                resolve(updateNotes);
            })
        });
    } catch (error) {
        yield put({
            type: scholarshipsActions.UPDATE_SCHOLARSHIP_NOTES_FAILURE,
            notesError: true
        });
    }
}

function* updateApproval(payload) {
    try {
        const documentId = payload.documentId;
        const status = payload.approval;
        const appType = payload.appType;
        const getScholarshipRef = getSingleScholarship(documentId);

        let updateDB = {};
        updateDB["".concat("admin", ".", "approvalStatus", ".", appType)] = status;
        let updated = false;

        const updateNotes = yield call(() => {
            return new Promise((resolve, reject) => {
                getScholarshipRef.update(updateDB)
                    .then(() => {
                        updated = true;
                    })
                    .catch((error) => {
                        console.log("error updating application in firebase:", error);
                    });
                resolve(updateNotes);
            })
        });
    } catch (error) {
        yield put({
            type: scholarshipsActions.UPDATE_SCHOLARSHIP_APPROVAL_FAILURE,
            approvalError: true
        });
    }
}

// posts data to the php to send an applicant an email
function email(userEmail, emailArray, name, approvalStatus) {
    const API_PATH = SCHOLARSHIP_API_PATH();

    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            userEmail: userEmail,
            emailArray: emailArray,
            approvalStatus: approvalStatus,
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
                const doEmail = email(payload.userEmail, payload.emailArray, payload.name, payload.approvalStatus)
                resolve(doEmail);
            })
        });

        console.log("email data:", data);

        const collectionRef = getSingleScholarship(userId);
        let applicationUpdated = false;
        let applicationFetched = false;
        let firebaseError = false;
        let updatedApp = null;

        if(data.status) {

            const update = yield call(() => {
                return new Promise((resolve, reject) => {

                    if(scholarshipType === "higherEdu") {
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
        }

        if(applicationUpdated) {
            const fetchScholarship = yield call(() => {
                return new Promise((resolve, reject) => {
                    collectionRef.get()
                        .then((doc) => {
                            if(doc.exists) {
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

            if(updatedApp !== null) {
                yield notifySingleScholarshipFetched(updatedApp);
            } else {

            }
        }

        console.groupEnd();

    } catch (error) {
        console.log("%c sendEmail SAGA ERROR:" + error, 'color: red');
    }
}

function* scholarshipDelete(payload) {
    try {
        let scholarshipAppDeleted = false;
        const ref = getSingleScholarship(payload.documentId);
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
            yield notifyScholarshipDeleted();
        }

    } catch (error) {
        console.log("scholarshipDelete error:", error);
    }
}

function* notifyScholarshipDeleted() {
    try {
        yield put({
            type: scholarshipsActions.DELETE_SCHOLARSHIP_SUCCESS,
        });
    } catch (error) {
        console.log("notifyScholarshipDeleted error:", error);
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(scholarshipsActions.FETCH_SCHOLARSHIPS_START, initScholarships),
        takeEvery(scholarshipsActions.FETCH_SINGLE_SCHOLARSHIP_START, getSingleScholarship),
        takeEvery(scholarshipsActions.UPDATE_SCHOLARSHIP_GRADES, updateGrades),
        takeEvery(scholarshipsActions.UPDATE_SCHOLARSHIP_NOTES, updateNotes),
        takeEvery(scholarshipsActions.UPDATE_SCHOLARSHIP_APPROVAL, updateApproval),
        takeEvery(scholarshipsActions.SEND_SCHOLARSHIP_EMAIL, sendEmail),
        takeEvery(scholarshipsActions.DELETE_SCHOLARSHIP, scholarshipDelete),
    ]);
}