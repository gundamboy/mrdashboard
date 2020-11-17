import { all, takeEvery, put, call } from 'redux-saga/effects';
import sponsorshipActions from './actions';
import { rsfSponsorships, dbSponsorships,  } from '@iso/lib/firebase/firebase';
import axios from 'axios';
import * as firebase from "firebase";

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

function* getSingleApplication(documentId) {
    try {
        const collectionRef = dbSponsorships.collection("sponsorships");
        const snapshots = yield call(rsfSponsorships.firestore.getCollection, collectionRef);
        const applications = snapshots.docs.map(doc => ({id: doc.id, ...doc.data()}));

        if (applications.length) {
            for ( let idx in applications ) {
                if ( applications[idx].id === documentId.payload ) {
                    yield put({
                        type: sponsorshipActions.FETCH_SINGLE_APPLICATION,
                        currentApp: applications[idx]
                    })
                }
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

function* updateApplication(application) {
    try {
        console.group("updateApplication SAGA");
        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
        let updatedApp = {};
        let applicationUpdated = false;
        const appAdmin = application.payload.admin;

        console.log("updateApplication application:", application.payload);
        console.log("updateApplication application.payload.id:", application.payload.id);
        console.log("updateApplication appAdmin:", appAdmin);

        yield call([
            collectionRef.update({
                "admin.amountApproved": appAdmin.amountApproved,
                "admin.approvalDate": appAdmin.approvalDate,
                "admin.approvalStatus": appAdmin.approvalStatus,
                "admin.itemsApproved": appAdmin.itemsApproved,
                "admin.notes": appAdmin.notes,
                "admin.notificationEmailed": appAdmin.notificationEmailed,
                "admin.notificationEmailedDate": appAdmin.notificationEmailedDate,
                "admin.submitterNotified": appAdmin.submitterNotified,
            }).then(() => {
                const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
                collectionRef.get().then((doc) => {
                    updatedApp = doc.data();
                    applicationUpdated = true;
                    console.log("updateApplication get doc updatedApp:", updatedApp);
                });
            })
        ]);

        console.log("updateApplication updatedApp AFTER:", updatedApp);
        console.groupEnd();

        if(updatedApp.length) {
            yield put({
                type: sponsorshipActions.UPDATE_APPLICATION,
                applicationUpdated: applicationUpdated,
                currentApp: updatedApp,
                updatedApp: updatedApp
            })
        }
    } catch (error) {
        console.group("updateApplication SAGA ERROR");
        console.log("message:", error.message);
        console.groupEnd();
    }
}

function email(application, email) {
    const API_PATH = "http://localhost:8888/midrivers/isomorphic-admin-dashboard/packages/isomorphic-midrivers/php/sponsorship-emails.php";
    
    return axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: {
            application: application,
            emailArray: email
        }
    });
}

function* sendEmail(application) {
    try {

        console.group("%c sendEmail Main", 'background: #BFACAA; color: #222; padding: 5px;')
        console.log("sendEmail(application): ", application);


        const { data } = yield call(email, application.payload, application.emailArray);
        console.log("data:", data);

        const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
        let updatedApp = {};
        let applicationUpdated = false;
         /**
        yield call([
            collectionRef.update({
                "admin.notificationEmailed": data.status,
                "admin.notificationEmailedDate": data.status ? firebase.firestore.Timestamp.fromDate(new Date()) : "",
                "admin.submitterNotified": data.status,
            }).then(() => {
                const collectionRef = dbSponsorships.collection("sponsorships").doc(application.payload.id);
                collectionRef.get().then((doc) => {
                    updatedApp = doc.data();
                    applicationUpdated = true;
                });
            })
        ]);
        */

        // yield put({
        //     type: sponsorshipActions.SEND_EMAIL_SUCCESS,
        //     emailSent: data.status,
        //     // currentApp: updatedApp
        // })

        console.groupEnd();

    } catch (error) {
        console.log("%c sendEmail SAGA ERROR:" + error, 'color: red');
        yield put({
            type: sponsorshipActions.SEND_EMAIL_ERROR,
            error: error.message
        })
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(sponsorshipActions.FETCH_APPLICATIONS_START, initSponsorshipApplications),
        takeEvery(sponsorshipActions.FETCH_SINGLE_APPLICATION, getSingleApplication),
        takeEvery(sponsorshipActions.UPDATE_APPLICATION, updateApplication),
        takeEvery(sponsorshipActions.SEND_EMAIL, sendEmail),
    ]);
}

