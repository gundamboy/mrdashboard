import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import grantsActions from "./actions";
import {rsfProjects, dbProjects, authProjects, db} from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import {getCurrentYear, GRANT_API_PATH, REFERRALS_API_PATH} from "../../helpers/shared";

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
        console.log("grants initGrants error:", e);
        yield put({
            type: grantsActions.FETCH_GRANTS_FAILURE,
            payload: e
        })
    }
}

function formatNumbers(amount) {
    return amount.replace(/[^0-9]/g, '');
}

function* getSingleGrant(documentId) {
    try {
        let grant = null;
        let totalGrants = 0;
        let totalAmount = 0;

        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

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

            const collectionRef = getGrantsCollectionRef();
            const snapshots = yield call(rsfProjects.firestore.getCollection, collectionRef);
            const grants = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));
            totalGrants = grants.length;

            for (let grant of grants) {
                totalAmount += parseInt(formatNumbers(grant.amountRequested));
            }
        }

        if(grant !== null) {
            yield put({
                type: grantsActions.FETCH_SINGLE_GRANT_SUCCESS,
                currentGrant: grant,
                totalGrants: totalGrants,
                totalGrantsAmount: Number(totalAmount).toLocaleString('en', options)
            });
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

function* notifyGrantUpdated(updatedApp) {
    try {
        yield put({
            type: grantsActions.UPDATE_GRANT_SUCCESS,
            currentGrant: updatedApp,
        });
    } catch (e) {
        console.log("notifyGrantNotesUpdated error", e);
    }
}

function* updateGrantApplication(appObject) {
    try {
        const collectionRef = getGrantsRef(appObject.payload.id);
        const updateObj = appObject.payload.toUpdate
        let updatedApp = {};
        let applicationUpdated = false;

        const update = yield call(() => {
            return new Promise((resolve, reject) => {
                collectionRef.update(updateObj)
                    .then(() => {
                        const collectionRef = getGrantsRef(appObject.payload.id);
                        //const collectionRef = dbProjects.collection("grants").doc(currentYear).collection("applications").doc(appObject.payload.id);
                        collectionRef.get().then((doc) => {
                            updatedApp = doc.data();
                            applicationUpdated = true;

                            resolve(update);
                        });
                    })
                    .catch((error) => {
                        console.log("error updating grant in firebase:", error);
                    });
            })
        });

        if(applicationUpdated) {
            yield notifyGrantUpdated(updatedApp);
        }
    } catch (e) {
        console.log("updateGrantApplication error", e);
        yield put({
            type: grantsActions.UPDATE_GRANT_FAILURE,
            payload: e
        })
    }
}

function* sendGrantEmail(payload) {
    try {
        console.log("sendGrantEmail payload:", payload);
        const userId = payload.payload.id;
        const email = payload.payload.email;
        const name = payload.payload.name;

        const { data } = yield call(() => {
            return new Promise((resolve, reject) => {
                const doEmail = emailGrant(email, name, payload.emailTextArray)
                resolve(doEmail);
            })
        });

        console.log("data:", data);

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

function emailGrant(email, name, emailTextArray) {
    const API_PATH = GRANT_API_PATH();

    console.log("email:", email);
    console.log("name:", name);
    console.log("emailTextArray:", emailTextArray);

    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            email: email,
            name: name,
            emailArray: emailTextArray
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
        takeEvery(grantsActions.FETCH_SINGLE_GRANT, getSingleGrant),
        takeEvery(grantsActions.UPDATE_GRANT, updateGrantApplication),
        takeEvery(grantsActions.SEND_GRANT_EMAIL_START, sendGrantEmail),

    ]);
}