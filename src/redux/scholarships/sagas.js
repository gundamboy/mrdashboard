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

function* initScholarships() {
    console.group("SAGA initScholarships");
    console.log("inside initScholarships");

    try {
        const currentYear = getCurrentYear().toString();
        const collectionRef = db.collection("scholarships").doc(currentYear).collection("applications");
        const snapshots = yield call(rsf.firestore.getCollection, collectionRef);
        const scholarships = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        console.log("scholarships", scholarships);

        yield put( {
            type: scholarshipsActions.FETCH_SCHOLARSHIPS_SUCCESS,
            payload: scholarships
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

export default function* rootSaga() {
    yield all([
        takeEvery(scholarshipsActions.FETCH_SCHOLARSHIPS_START, initScholarships),
    ]);
}