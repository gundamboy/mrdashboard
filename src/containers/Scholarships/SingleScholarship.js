import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useParams } from 'react-router-dom';
import {Redirect} from "react-router";
import LayoutContent from "@iso/components/utility/layoutContent";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import scholarshipsActions from "../../redux/scholarships/actions";
import ViewScholarship from "./ViewScholarship";

const {
    fetchSingleApplicationStart
} = scholarshipsActions;

export default function SingleScholarship() {
    const {currentScholarship, scholarshipLoading, activeTab, scholarshipDeleted, scholarshipEmailError,
        scholarshipFirebaseError, adminIsSaving} = useSelector(state => state.Scholarships);
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const urlArray = match.url.split("/");
    const scholarshipType  = urlArray.slice(-1).pop();
    const scholarshipId  = urlArray[urlArray.length-2];
    const redirectPath = match.url.replace(scholarshipId + "/" + scholarshipType, '');

    // this is like componentDidMount but its for a function component and not a class
    useEffect(() => {
        dispatch(fetchSingleApplicationStart(scholarshipId));
    }, [dispatch]);

    if(scholarshipDeleted) {
        return <Redirect to="/dashboard/scholarships" />
    }

    if(currentScholarship) {
        return (
            <>
                <ViewScholarship
                    currentScholarship={currentScholarship}
                    scholarshipType={scholarshipType}
                    scholarshipLoading={scholarshipLoading}
                    redirectPath={redirectPath}
                    activeTab={activeTab}
                    userId={scholarshipId}
                    scholarshipDeleted={scholarshipDeleted}
                    emailError={scholarshipEmailError}
                    scholarshipFirebaseError={scholarshipFirebaseError}
                    notes={currentScholarship.admin.notes}
                    adminIsSaving={adminIsSaving}
                />
            </>
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
