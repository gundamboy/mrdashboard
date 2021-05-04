import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useParams } from 'react-router-dom';
import ViewReferral from "./ViewReferral";
import referralActions from "../../redux/referrals/actions";
import LayoutContent from "@iso/components/utility/layoutContent";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';

export default function SingleReferral() {
    const {currentReferral, referralsLoading, referralsActiveTab,
        referralEmailStatus, referralEmailError,
        referralsFirebaseEmailError, sendingEmail} = useSelector(state => state.referralsReducer)
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const urlArray = match.url.split("/");
    const referralId  = urlArray.slice(-1).pop();
    const redirectPath = match.url.replace(referralId, '');

    const getCurrentReferral = useCallback(
        () => dispatch(referralActions.fetchSingleReferralStart(referralId)),
        [dispatch]
    );

    useEffect(() => {
        getCurrentReferral();
    }, [getCurrentReferral]);

    // if an email was sent, just get out of here.
    if(referralEmailStatus) {
        //return <Redirect to={redirectPath} />;
    }

    if(typeof currentReferral === 'object') {
        return (
            <ViewReferral
                currentReferral={currentReferral}
                loading={referralsLoading}
                emailSent={referralEmailStatus}
                emailError={referralEmailError}
                referralsFirebaseEmailError={referralsFirebaseEmailError}
                redirectPath={redirectPath}
                activeTab={referralsActiveTab}
                userId={referralId}
                sendingEmail={sendingEmail}
            />
        )
    } else {
        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <LayoutContent className={"ant-spin-nested-loading"}>
                    <TableWrapper
                        loading={true}/>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }

}