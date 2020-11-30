import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import sponsorshipActions from './actions';
import { rsfSponsorships, dbSponsorships,  } from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import actions from "@iso/redux/auth/actions";

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
            console.log("getApplication: ", getApplication);

            const fetchApplication = yield call(() => {
                return new Promise((resolve, reject) => {
                    getApplication.get()
                        .then((doc) => {
                            if (doc.exists) {
                                sponsorship = {id: documentId.payload, ...doc.data()};
                                resolve(fetchApplication);
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

function* notifySingleApplicationError() {
    try {
        yield put({
            type: sponsorshipActions.FETCH_SINGLE_APPLICATION_ERROR,
            singleAppError: true,
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
        console.group("updateApplication SAGA");
        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
        let updatedApp = {};
        let applicationUpdated = false;
        const appAdmin = application.payload.admin;

        const update = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.update({
                    "admin.amountApproved": appAdmin.amountApproved,
                    "admin.approvalDate": appAdmin.approvalDate,
                    "admin.approvalStatus": appAdmin.approvalStatus,
                    "admin.itemsApproved": appAdmin.itemsApproved,
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
    const API_PATH = "http://localhost:8888/midrivers/isomorphic-admin-dashboard/packages/isomorphic-midrivers/php/sponsorship-emails.php";
    //const API_PATH = "/php/sponsorship-emails.php";

    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            application: application,
            emailArray: email
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
function* deleteSponsorship(id) {
    try {
        const collectionRef = dbSponsorships.collection("sponsorships").doc(id);
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
            })
        }

    } catch (error) {
        console.log("%c deleteSponsorship SAGA ERROR:" + error, 'color: red');
        yield put(sponsorshipActions.deleteSponsorshipError(error, error.message))
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(sponsorshipActions.FETCH_APPLICATIONS_START, initSponsorshipApplications),
        takeEvery(sponsorshipActions.FETCH_SINGLE_APPLICATION, getSingleApplication),
        takeEvery(sponsorshipActions.UPDATE_APPLICATION, updateApplication),
        takeEvery(sponsorshipActions.SEND_EMAIL, sendEmail),
        takeEvery(sponsorshipActions.DELETE_APPLICATION, deleteSponsorship),
    ]);
}
