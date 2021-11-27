import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useParams } from 'react-router-dom';
import LayoutContent from "@iso/components/utility/layoutContent";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import {Redirect} from "react-router";
import grantsActions from "../../redux/grants/actions";
import ViewGrant from "./ViewGrant";

export default function SingleGrant() {
    const { currentGrant, grantsActiveTab, grantEmailStatus,
        grantEmailError,  grantFirebaseError, totalGrants, totalGrantsAmount } = useSelector(state => state.grantsReducer);
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const urlArray = match.url.split("/");
    const grantId  = urlArray[urlArray.length-1];
    const redirectPath = match.url.replace(grantId, '');

    console.log("state:", useSelector(state => state.grantsReducer));

    const getCurrentGrant = useCallback(
        () => dispatch(grantsActions.fetchSingleGrant(grantId)),
        [dispatch]
    );

    useEffect(() => {
        getCurrentGrant();
    }, [getCurrentGrant]);


    if(currentGrant) {
        return (
            <ViewGrant
            currentGrant={currentGrant}
            grantId={grantId}
            activeTab={grantsActiveTab}
            emailSent={grantEmailStatus === true}
            emailError={grantEmailStatus === false}
            grantEmailError={grantEmailError}
            fbError={grantFirebaseError}
            totalGrants={totalGrants}
            totalGrantsAmount={totalGrantsAmount}
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