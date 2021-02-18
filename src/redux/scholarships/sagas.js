import { all, takeEvery, put, call, delay } from 'redux-saga/effects';
import scholarshipsActions from './actions';
import { db, auth, rsf } from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";
import actions from "@iso/redux/auth/actions";
import {getCurrentYear} from "../../helpers/shared";
/**
 *
export const auth = firebase.auth();
 export const db = firebase.firestore();
 export const rsf = new ReduxSagaFirebase(firebaseApp);
 export default firebase;
 */

const currentYear = getCurrentYear().toString();

function* initScholarships() {
    console.group("SAGA initScholarships");
    try {

        const collectionRef = db.collection("scholarships").doc(currentYear).collection("applications");
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
    console.log("get single scholarship id:", documentId);
    try {
        let scholarship = null;

        if(documentId) {
            const getScholarshipRef = db.collection("scholarships").doc(currentYear).collection("applications").doc(documentId.payload);

            const fetchScholarship = yield call(() => {
                return new Promise((resolve, reject) => {
                    getScholarshipRef.get()
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

export default function* rootSaga() {
    yield all([
        takeEvery(scholarshipsActions.FETCH_SCHOLARSHIPS_START, initScholarships),
        takeEvery(scholarshipsActions.FETCH_SINGLE_SCHOLARSHIP_START, getSingleScholarship),
    ]);
}