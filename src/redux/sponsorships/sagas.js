import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import sponsorshipActions from './actions';
import { rsfSponsorships, dbSponsorships, sponsorshipsStorage } from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import actions from "@iso/redux/auth/actions";
import {makeId} from "@iso/lib/helpers/utility";
import {SPONSORSHIP_API_PATH} from "../../helpers/shared";

// gets all the sponsorships for the dashboard tables
function* initSponsorshipApplications() {
    try {
        const collectionRef = dbSponsorships.collection("sponsorships");
        const snapshots = yield call(rsfSponsorships.firestore.getCollection, collectionRef);
        const applications = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        yield put({
            type: sponsorshipActions.FETCH_APPLICATIONS_SUCCESS,
            payload: applications
        })
    } catch (error) {
        console.log(error);
        yield put({
            type: sponsorshipActions.FETCH_APPLICATIONS_FAILURE,
            payload: error
        });
    }
}

// gets a single sponsorship for the view scholarship page
function* getSingleApplication(documentId) {
    try {
        let sponsorship = null;
        let appError = false;

        if (documentId) {
            const getApplication = dbSponsorships.collection("sponsorships").doc(documentId.payload);

            const fetchApplication = yield call(() => {
                return new Promise((resolve, reject) => {
                    getApplication.get()
                        .then((doc) => {
                            if (doc.exists) {
                                const app = doc.data();

                                if(app.meta.hasFiles) {
                                    const storageRef = sponsorshipsStorage.ref();
                                    const storageItems = storageRef.child(documentId.payload);
                                    let fileInfo = {};

                                    storageItems.listAll().then((res) => {
                                        res.items.forEach((itemRef) => {
                                            itemRef.getDownloadURL().then((url) => {
                                                fileInfo['name'] = itemRef.name;
                                                fileInfo['url'] = url;

                                                sponsorship = {id: documentId.payload, fileInfo: fileInfo, ...doc.data()};
                                                resolve(fetchApplication);
                                            })

                                        })
                                    });
                                } else {
                                    sponsorship = {id: documentId.payload, fileInfo: null, ...doc.data()};
                                    resolve(fetchApplication);
                                }
                            } else {
                                console.log("DOC DOES NOT EXIST");
                                console.log("Should be forced error");
                                resolve(fetchApplication);
                            }
                        }).catch((error) => {

                        console.log("getApplication error:", error);
                    })
                });
            });

            if(sponsorship !== null) {
                yield notifySingleApplicationFetched(sponsorship);
            } else {
                console.log("sponsorship not resolved");
            }
        }

    } catch (error) {
        console.log(error);
        yield put({
            type: sponsorshipActions.FETCH_APPLICATIONS_FAILURE,
            payload: error
        });
    }
}

function* notifySingleApplicationFetched(sponsorship) {
    try {
        yield put({
            type: sponsorshipActions.FETCH_SINGLE_APPLICATION_SUCCESS,
            currentApp: sponsorship
        })
    } catch (error) {

    }
}

// updates the state when a sponsorship has been updated from the admin panel
function* notifyAppUpdated(updatedApp) {
    try {
        yield put({
            type: sponsorshipActions.UPDATE_APPLICATION_SUCCESS,
            applicationUpdated: true,
            currentApp: updatedApp,
            updatedApp: updatedApp,
            saveLoading: false
        })
    } catch (error) {
        yield put(sponsorshipActions.emailError(false, true));
        console.group("notifyAppUpdated SAGA ERROR");
        console.log("message:", error.message);
        console.groupEnd();
    }
}

// initiates the sponsorship update process
function* updateApplication(application) {
    try {
        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
        let updatedApp = {};
        let applicationUpdated = false;
        const appAdmin = application.payload.admin;

        const update = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.update({
                    "admin.amountApproved": appAdmin.amountApproved !== undefined ? appAdmin.amountApproved : "",
                    "admin.approvalDate": appAdmin.approvalDate,
                    "admin.approvalStatus": appAdmin.approvalStatus,
                    "admin.itemsApproved": appAdmin.itemsApproved.length ? appAdmin.itemsApproved : "",
                    "admin.notes": appAdmin.notes,
                }).then(() => {
                    const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
                    collectionRef.get().then((doc) => {
                        updatedApp = doc.data();
                        applicationUpdated = true;

                        resolve(update);
                    });
                })
            });
        });

        if(applicationUpdated) {
            yield notifyAppUpdated(updatedApp)
        }

    } catch (error) {
        yield put(sponsorshipActions.emailError(false, true));
        console.group("updateApplication SAGA ERROR");
        console.log("message:", error.message);
        console.groupEnd();
    }
}

// posts data to the php to send an applicant an email
function email(application, email) {
    const API_PATH = SPONSORSHIP_API_PATH();

    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            application: application,
            emailArray: email,
        }
    }).catch((error) => {
        console.log("axios error:", error);
    });
}

// initiates the sending of an email and updates firebase to reflect an email was sent, disabling all edit fields
function* sendEmail(application) {
    try {
        console.group("%c sendEmail Main", 'background: #BFACAA; color: #222; padding: 5px;');

        const { data } = yield call(() => {
            return new Promise((resolve, reject) => {
                const doEmail = email(application.payload, application.emailArray)
                resolve(doEmail);
            })
        });

        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
        let applicationUpdated = false;
        let firebaseError = false;

        if(data.status) {
            let updatedApp = {};

            const update = yield call(() => {
                return new Promise((resolve, reject) => {
                    collectionRef.update({
                        "admin.notificationEmailed": data.status,
                        "admin.notificationEmailedDate": data.status ? firebase.firestore.Timestamp.fromDate(new Date()) : "",
                    }).then(() => {
                        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
                        collectionRef.get().then((doc) => {
                            updatedApp = doc.data();
                            applicationUpdated = true;

                            updatedApp = {
                                id: application.payload.id,
                                ...updatedApp
                            }
                            resolve(update);
                        });
                    }).catch((error) => {
                        console.log("firebase update error", error);
                        firebaseError = true;
                    })
                })
            });

            if (firebaseError) {
                yield put(sponsorshipActions.emailError(false, true))
            } else {
                yield put({
                    type: sponsorshipActions.SEND_EMAIL_SUCCESS,
                    emailSent: true,
                    emailError: false,
                    fbError: false,
                    emailLoading: false,
                    currentApp: updatedApp,
                })
            }
        } else {
            yield put(sponsorshipActions.emailError(true, false));
        }

        console.groupEnd();
    } catch (error) {
        console.log("%c sendEmail SAGA ERROR:" + error, 'color: red');
        yield put(sponsorshipActions.emailError(error, true))
    }
}

// deletes a single sponsorship
function* deleteSponsorship(data) {
    try {
        const collectionRef = dbSponsorships.collection("sponsorships").doc(data.id);
        let deleted = false;
        let deleteError = false;

        const deleteApp = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.delete()
                    .then(() => {
                        deleted = true;
                        resolve(deleteApp);
                    })
                    .catch((error) => {
                        deleteError = true;
                        console.log("error deleting app:", error)
                    });
                })
            });

        if(deleted) {
            yield put({
                type: sponsorshipActions.DELETE_APPLICATION_SUCCESS,
                appDeleted: true,
            });
        }

    } catch (error) {
        console.log("%c deleteSponsorship SAGA ERROR:" + error, 'color: red');
        yield put(sponsorshipActions.deleteSponsorshipError(error, error.message))
    }
}

// add dummy data
function* addDummyData(data) {
    try {
        const dataType = data.dataType;
        const randomId = makeId(28);
        const dummyData = {
            submission: {
                sponsorshipSelect: dataType,
                orgName: "Dummy Org",
                orgEstablished: "1980",
                orgAddress: "123 Nowhere St.",
                orgCity: "Glendive",
                orgState: "MT",
                orgZip: "59330",
                orgWebsite: "www.google.com",
                orgFacebook: "http://www.facebook.com",
                orgInstagram: "blahblah",
                orgTwitter: "nopenope",
                primaryName: "Test McTester",
                primaryEmail: "charles.rowland@midrivers.coop",
                primaryPhone: "555-555-5555",
                primaryAddress: "123 Nopeville Rd",
                primaryCity: "Nopeville",
                primaryState: "MT",
                primaryZip: "59330",
                relationship: "Self",
                eventName: "Dashboard " + dataType + " test",
                eventStartDate: "2020-10-01",
                eventEndDate: "2020-10-05",
                eventDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                eventPurpose: "to test the dashboard",
                eventBenefits: "finishing the project",
                advertisingStart: "2020-10-01",
                advertisingEnd: "2020-10-05",
                advertisingAudience: "little 'ol me",
                advertisingDetails: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                eventItemsDate: dataType === "Material" ? "2020-10-04" : "",
                eventItems: dataType === "Material" ? "2 sneks and 1 woof woof" : "",
                eventMoney: dataType === "Monetary" ? "100" : "",
                eventMoneyDate: dataType === "Monetary" ? "2020-10-01" : "",
                reference: "nobody",
                additionalInformation: "as if...",
            },
            meta: {
                submissionDate: firebase.firestore.Timestamp.now(),
                hasFiles: false
            },
            admin: {
                approvalStatus: "pending",
                approvalDate: "",
                amountApproved: 0,
                itemsApproved: "",
                submitterNotified: false,
                notes: "",
                notificationEmailed: false,
                notificationEmailedDate: ""
            }
        }
        let dataInserted = false;
        let insertError = false;
        let errorMessage = null

        const insertDummyData = yield call(() => {
            return new Promise((resolve, reject) => {
                dbSponsorships.collection("sponsorships")
                    .doc(randomId)
                    .set(dummyData)
                    .then(() => {
                        dataInserted = true;
                        resolve(insertDummyData);
                    })
                    .catch((error) => {
                        insertError = true;
                        errorMessage = error
                        console.error("Error writing document: ", error);
                    });
            });
        });

        if(dataInserted) {
            yield put({
                type: sponsorshipActions.INSERT_DUMMY_DATA_SUCCESS,
                dataInserted: true
            });
        }
    } catch (error) {

    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(sponsorshipActions.FETCH_APPLICATIONS_START, initSponsorshipApplications),
        takeEvery(sponsorshipActions.FETCH_SINGLE_APPLICATION, getSingleApplication),
        takeEvery(sponsorshipActions.UPDATE_APPLICATION, updateApplication),
        takeEvery(sponsorshipActions.SEND_EMAIL, sendEmail),
        takeEvery(sponsorshipActions.DELETE_APPLICATION, deleteSponsorship),
        takeEvery(sponsorshipActions.INSERT_DUMMY_DATA, addDummyData),
    ]);
}

