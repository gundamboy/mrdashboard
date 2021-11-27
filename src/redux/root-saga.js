import { all } from 'redux-saga/effects';
import authSagas from '@iso/redux/auth/saga';
import ecommerceSaga from '@iso/redux/ecommerce/saga';
import initSponsorshipApplications from './sponsorships/sagas';
import initScholarships from './scholarships/sagas';
import initReferrals from './referrals/sagas';
import initGrants from './grants/sagas';

export default function* rootSaga(getState) {
  yield all([
      authSagas(),
    ecommerceSaga(),
    initSponsorshipApplications(),
    initScholarships(),
    initReferrals(),
    initGrants(),
  ]);
}
