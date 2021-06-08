import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import referralActions from "./actions";
import {rsfProjects, dbProjects, authProjects, db} from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import {getCurrentYear, REFERRALS_API_PATH} from "../../helpers/shared";

const currentYear = getCurrentYear().toString();

function getReferralsRef (documentId) {
    return dbProjects.collection("referrals").doc(currentYear).collection("applications").doc(documentId);
}

const getReferralsCollectionRef = () => {
    return dbProjects.collection("referrals").doc(currentYear).collection("applications");
}

function* initReferrals() {
    try {
        const collectionRef = getReferralsCollectionRef();
        const snapshots = yield call(rsfProjects.firestore.getCollection, collectionRef);
        const referrals = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        yield put( {
            type: referralActions.FETCH_REFERRALS_SUCCESS,
            payload: referrals
        });
    } catch (e) {
        console.log("referrals initReferrals", e);
        yield put({
            type: referralActions.FETCH_REFERRALS_FAILURE,
            payload: e
        })
    }
}

function* getSingleReferral(documentId) {
    try {
        let referral = null;

        if(documentId) {
            const getReferral = getReferralsRef(documentId.payload);
            const fetchReferral = yield call(() => {
                return new Promise((resolve, reject) => {
                    getReferral.get()
                        .then((doc) => {
                            if(doc.exists) {
                                const app = doc.data();

                                referral = {id: documentId.payload, ...app};
                                resolve(fetchReferral);
                            }
                        })
                        .catch((error) => {
                            console.log("getSingleReferral error:", error);
                        });
                });
            });
        }

        if(referral !== null) {
            yield notifySingleReferralFetched(referral);
        } else {
            console.log("fetch single referral not resolved");
        }

    } catch (e) {
        console.log("getSingleReferral error", e);
        yield put({
            type: referralActions.FETCH_SINGLE_REFERRAL_FAILURE,
            payload: e
        })
    }
    console.groupEnd();
}

function* notifySingleReferralFetched(referral) {
    try {
        yield put({
            type: referralActions.FETCH_SINGLE_REFERRAL_SUCCESS,
            payload: referral
        });
    } catch (e) {
        console.log("notifySingleReferralFetched error", e);
        yield put({
            type: referralActions.FETCH_SINGLE_REFERRAL_SUCCESS,
            payload: e
        })
    }
}

function* updateReferralApproval(payload) {
    try {
        console.log("updateReferralApproval payload:", payload)
        const documentId = payload.referralId;
        const status = payload.status;
        const getReferral = getReferralsRef(documentId);
        console.log("")

        let updateDB = {};
        updateDB["referralStatus"] = status;
        updateDB["decisionDate"] = firebase.firestore.Timestamp.now();
        let updated = false;

        const updateApp = yield call(() => {
            return new Promise((resolve, reject) => {
                getReferral.update(updateDB)
                    .then(() => {
                        updated = true;
                    })
                    .catch((error) => {
                        console.log("error updating referral in firebase:", error);
                    });
                resolve(updateApp);
            })
        });

        if(updated === true) {
            notifyReferralNotesUpdated();
        }
    } catch (e) {
        console.log("updateReferralApproval error", e);
        yield put({
            type: referralActions.UPDATE_REFERRAL_FAILURE,
            payload: e
        })
    }
}

function* updateNotes(payload) {
    try {
        const documentId = payload.referralId;
        const notes = payload.notes;
        const getSingleReferralRef = getReferralsRef(documentId);

        let updateDB = {};
        updateDB["notes"] = notes;
        let updated = false;

        const updateNotes = yield call(() => {
            return new Promise((resolve, reject) => {
                getSingleReferralRef.update(updateDB)
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
            notifyReferralNotesUpdated();
        }

    } catch (error) {
        yield put({
            type: referralActions.UPDATE_REFERRAL_NOTES_ERROR,
            referralNotesError: true
        });
    }
}

function* notifyReferralNotesUpdated() {
    try {
        yield put({
            type: referralActions.UPDATE_REFERRAL_NOTES_SUCCESS,
        });
    } catch (e) {
        console.log("notifyReferralNotesUpdated error", e);
    }
}

function* sendReferralEmail(payload) {
    try {
        const userId = payload.userId;

        const { data } = yield call(() => {
            return new Promise((resolve, reject) => {
                const doEmail = emailReferral(payload.referrerEmail, payload.refereeEmail, payload.referrerName, payload.personYouAreReferring, payload.emailArray, payload.userId, payload.approvalStatus)
                resolve(doEmail);
            })
        });

        if(!data) {
            yield put(referralActions.sendReferralEmailFailure(true, false));
        }

        const collectionRef = getReferralsRef(userId);
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
                yield put(referralActions.sendReferralEmailFailure(false, true));
            }
        } else {
            yield put(referralActions.sendReferralEmailFailure(true, false));
        }

        if(applicationUpdated) {
            yield getSingleReferral({payload: userId});
        }
    } catch (e) {
        console.log("sendReferralEmail error", e);
        yield put({
            type: referralActions.SEND_REFERRAL_EMAIL_ERROR,
            payload: e
        })
    }
}

function emailReferral(referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray, userId, status) {
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


export default function* rootSaga() {
    yield all([
        takeEvery(referralActions.FETCH_REFERRALS_START, initReferrals),
        takeEvery(referralActions.FETCH_SINGLE_REFERRAL_START, getSingleReferral),
        takeEvery(referralActions.UPDATE_REFERRAL_START, updateReferralApproval),
        takeEvery(referralActions.UPDATE_REFERRAL_NOTES_START, updateNotes),
        takeEvery(referralActions.SEND_REFERRAL_EMAIL_START, sendReferralEmail),

    ]);
}