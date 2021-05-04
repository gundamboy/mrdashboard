import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import grantsActions from "./actions";
import {rsfProjects, dbProjects, authProjects, db} from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import {getCurrentYear, REFERRALS_API_PATH} from "../../helpers/shared";

const currentYear = getCurrentYear().toString();

function getGrantsRef (documentId) {
    return dbProjects.collection("grants").doc(currentYear).collection("applications").doc(documentId);
}

const getGrantsCollectionRef = () => {
    return dbProjects.collection("grants").doc(currentYear).collection("applications");
}

function* getSingleGrantNonNotify(documentId) {
    try {
        let grant = null;

        if(documentId) {
            const getGrant = getGrantsRef(documentId.payload);

            const fetchGrant = yield call(() => {
                return new Promise((resolve, reject) => {
                    getGrant.get()
                        .then((doc) => {
                            if(doc.exists) {
                                const app = doc.data();
                                grant = {id: documentId.payload, ...app};
                                resolve(fetchGrant);
                            }
                        })
                        .catch((error) => {
                            console.log("getSingleGrantNonNotify error:", error);
                        });
                });
            });
        }

        if(grant !== null) {
            return grant;
        } else {
            console.log("fetch single grant non notified not resolved");
        }

    } catch (e) {
        console.log("getSingleGrantNonNotify error", e);
    }
}

function* initGrants() {
    try {
        const collectionRef = getGrantsCollectionRef();
        const snapshots = yield call(rsfProjects.firestore.getCollection, collectionRef);
        const grants = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        yield put( {
            type: grantsActions.FETCH_GRANTS_SUCCESS,
            payload: grants
        });
    } catch (e) {
        console.log("grants initGrants", e);
        yield put({
            type: grantsActions.FETCH_GRANTS_FAILURE,
            payload: e
        })
    }
}

function* getSingleGrant(documentId) {
    try {
        let grant = null;

        if(documentId) {
            const getGrant = getGrantsRef(documentId.payload);

            const fetchGrant = yield call(() => {
                return new Promise((resolve, reject) => {
                    getGrant.get()
                        .then((doc) => {
                            if(doc.exists) {
                                const app = doc.data();

                                grant = {id: documentId.payload, ...app};
                                resolve(fetchGrant);
                            }
                        })
                        .catch((error) => {
                            console.log("getSingleGrant error:", error);
                        });
                });
            });
        }

        if(grant !== null) {
            yield notifySingleGrantFetched(grant);
        } else {
            console.log("fetch single grant not resolved");
        }

    } catch (e) {
        console.log("getSingleGrant error", e);
        yield put({
            type: grantsActions.FETCH_SINGLE_GRANT_FAILURE,
            payload: e
        })
    }
    console.groupEnd();
}

function* notifySingleGrantFetched(grant) {
    try {
        yield put({
            type: grantsActions.FETCH_SINGLE_GRANT_SUCCESS,
            payload: grant
        });
    } catch (e) {
        console.log("notifySingleGrantFetched error", e);
        yield put({
            type: grantsActions.FETCH_SINGLE_GRANT_SUCCESS,
            payload: e
        })
    }
}

function* updateGrantApproval(payload) {
    try {
        console.log("updateGrantApproval payload:", payload)
        const documentId = payload.grantId;
        const status = payload.status;
        const getGrant = getGrantsRef(documentId);
        console.log("")

        let updateDB = {};
        updateDB["grantStatus"] = status;
        updateDB["decisionDate"] = firebase.firestore.Timestamp.now();
        let updated = false;

        const updateApp = yield call(() => {
            return new Promise((resolve, reject) => {
                getGrant.update(updateDB)
                    .then(() => {
                        updated = true;
                    })
                    .catch((error) => {
                        console.log("error updating grant in firebase:", error);
                    });
                resolve(updateApp);
            })
        });

        if(updated === true) {
            notifyGrantNotesUpdated();
        }
    } catch (e) {
        console.log("updateGrantApproval error", e);
        yield put({
            type: grantsActions.UPDATE_GRANT_FAILURE,
            payload: e
        })
    }
}

function* updateNotes(payload) {
    try {
        const documentId = payload.grantId;
        const notes = payload.notes;
        const getSingleGrantRef = getGrantsRef(documentId);

        let updateDB = {};
        updateDB["notes"] = notes;
        let updated = false;

        const updateNotes = yield call(() => {
            return new Promise((resolve, reject) => {
                getSingleGrantRef.update(updateDB)
                    .then(() => {
                        updated = true;
                    })
                    .catch((error) => {
                        console.log("error updating notes in firebase:", error);
                    });
                resolve(updateNotes);
            })
        });

        if(updated === true) {
            notifyGrantNotesUpdated();
        }

    } catch (error) {
        yield put({
            type: grantsActions.UPDATE_GRANT_NOTES_ERROR,
            grantNotesError: true
        });
    }
}

function* notifyGrantNotesUpdated() {
    try {
        yield put({
            type: grantsActions.UPDATE_GRANT_NOTES_SUCCESS,
        });
    } catch (e) {
        console.log("notifyGrantNotesUpdated error", e);
    }
}

function* sendGrantEmail(payload) {
    try {
        const userId = payload.userId;

        const { data } = yield call(() => {
            return new Promise((resolve, reject) => {
                const doEmail = emailGrant(payload.referrerEmail, payload.refereeEmail, payload.referrerName, payload.personYouAreReferring, payload.emailArray, payload.userId, payload.approvalStatus)
                resolve(doEmail);
            })
        });

        if(!data) {
            yield put(grantsActions.sendGrantEmailFailure(true, false));
        }

        const collectionRef = getGrantsRef(userId);
        let applicationUpdated = false;
        let firebaseError = false;

        if(data.status) {
            const update = yield call(() => {
                return new Promise((resolve, reject) => {
                    collectionRef.update({
                        "notificationEmailed": true,
                        "notificationEmailedDate": firebase.firestore.Timestamp.now()
                    }).then(() => {
                        applicationUpdated = true;
                        resolve(update);
                    }).catch((error) => {
                        console.log("email: update scholarship error:", error);
                        firebaseError = true;
                        resolve(update);
                    })

                    applicationUpdated = true;
                    resolve(update);
                });
            });

            if(firebaseError) {
                yield put(grantsActions.sendGrantEmailFailure(false, true));
            }
        } else {
            yield put(grantsActions.sendGrantEmailFailure(true, false));
        }

        if(applicationUpdated) {
            yield getSingleGrant({payload: userId});
        }
    } catch (e) {
        console.log("sendGrantEmail error", e);
        yield put({
            type: grantsActions.SEND_GRANT_EMAIL_ERROR,
            payload: e
        })
    }
}

function emailGrant(referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray, userId, status) {
    const API_PATH = REFERRALS_API_PATH();

    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            referrerEmail: referrerEmail,
            refereeEmail: refereeEmail,
            referrerName: referrerName,
            personYouAreReferring: personYouAreReferring,
            emailTextArray: emailTextArray,
            userId: userId,
            approvalStatus: status,
        }
    }).catch((error) => {
        console.log("axios error:", error);
    });
}


// dummy template function
// function* xxxx() {
//     try {
//
//     } catch (e) {
//         console.log("xxxx", e);
//         yield put({
//             type: grantsActions.xxxxxxxx,
//             payload: e
//         })
//     }
// }

export default function* rootSaga() {
    yield all([
        takeEvery(grantsActions.FETCH_GRANTS_START, initGrants),
        takeEvery(grantsActions.FETCH_SINGLE_GRANT_START, getSingleGrant),
        takeEvery(grantsActions.UPDATE_GRANT_START, updateGrantApproval),
        takeEvery(grantsActions.UPDATE_GRANT_NOTES_START, updateNotes),
        takeEvery(grantsActions.SEND_GRANT_EMAIL_START, sendGrantEmail),

    ]);
}