import { all } from 'redux-saga/effects';
import authSagas from '@iso/redux/auth/saga';
import ecommerceSaga from '@iso/redux/ecommerce/saga';
import initSponsorshipApplications from './sponsorships/sagas';
import initScholarships from './scholarships/sagas';

export default function* rootSaga(getState) {
  yield all([
      authSagas(),
    ecommerceSaga(),
    initSponsorshipApplications(),
    initScholarships(),
  ]);
}
