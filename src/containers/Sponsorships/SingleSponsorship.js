import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useParams } from 'react-router-dom';
import ViewSponsorship from "./ViewSponsorship";
import sponsorshipActions from "../../redux/sponsorships/actions";
import LayoutContent from "@iso/components/utility/layoutContent";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import {Redirect} from "react-router";

export default function SingleSponsorship() {
    const {currentApp, emailLoading, saveLoading, loading, emailSent,
        emailError, fbError, appDeleted, activeTab} = useSelector(state => state.sponsorshipsReducer);
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const urlArray = match.url.split("/");
    const sponsorshipId  = urlArray.slice(-1).pop();
    const redirectPath = match.url.replace(sponsorshipId, '');

    const getCurrentSponsorship = useCallback(
        () => dispatch(sponsorshipActions.fetchSingleApplication(sponsorshipId)),
        [dispatch]
    )

    useEffect(() => {
        getCurrentSponsorship();
    }, [getCurrentSponsorship]);


    // if an email was sent, just get out of here.
    if(emailSent) {
        //return <Redirect to={redirectPath} />;
    }

    // if the app was deleted, get outta here
    if(appDeleted) {
        return <Redirect to={redirectPath} />;
    }

    if (typeof currentApp === 'object') {
        return (
            <ViewSponsorship
                currentSponsorship={currentApp}
                loading={loading}
                emailSent={emailSent}
                emailError={emailError}
                saveLoading={saveLoading}
                emailLoading={emailLoading}
                fbError={fbError}
                appDeleted={appDeleted}
                redirectPath={redirectPath}
                activeTab={activeTab}
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