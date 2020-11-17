import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useParams } from 'react-router-dom';
import ViewSponsorship from "./ViewSponsorship";
import sponsorshipActions from "../../redux/sponsorships/actions";
import LayoutContent from "@iso/components/utility/layoutContent";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';



export default function SingleSponsorship() {
    const {currentApp, loading, emailSent} = useSelector(state => state.sponsorshipsReducer);
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

    if (typeof currentApp === 'object') {
        return (
            <ViewSponsorship
                currentSponsorship={currentApp}
                loading={loading}
                emailSent={emailSent}
                redirectPath={redirectPath}
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