import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {useDispatch, useSelector} from "react-redux";
import sponsorshipActions from "../../redux/sponsorships/actions";
import sponsorshipsReducer from "../../redux/sponsorships/reducer";
import * as TableViews from '../Tables/AntTables/TableViews/TableViews';
import Tabs, {TabPane} from "@iso/components/uielements/tabs";
import {sponsorshipColumns, sponsorshipTabs} from "../Tables/AntTables/configs";
import {Space, Spin } from "antd";
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import {Link, useRouteMatch} from "react-router-dom";
import Button from "@iso/components/uielements/button";


export default function Sponsorships() {
    let applications = [], pendingApplications = [], approvedApplications = [], deniedApplications = [];
    let Component = TableViews.SortView;
    const { results, loading, error, appDeleted,
        emailSent, dataInserted, activeTab } = useSelector(state => state.sponsorshipsReducer);
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const [currentTab, setCurrentTab] = useState(activeTab);

    console.log("Sponsorships DASHBOARD: ", useSelector(state => state.sponsorshipsReducer));

    // calls state from redux
    const getSponsorshipApplications = useCallback(
        () => dispatch(sponsorshipActions.fetchApplicationsStart()),
        [dispatch]
    );

    // this is like componentDidMount but its for a function component and not a class
    useEffect(() => {
        getSponsorshipApplications();
    }, [getSponsorshipApplications]);

    setTimeout(() => {
        if(target.current && appDeleted || target.current && emailSent) {
            // scroll up
            target.current.scrollIntoView(0,0);

            getSponsorshipApplications();
        }
    }, 3)

    const insertDummyData = useCallback(
        (dataType) => dispatch(sponsorshipActions.addDummyData(dataType)), [dispatch]
    );

    const onTabChange = (key) => {
        setCurrentTab(key);
    };


    // build the data sets needed for the table in each tab
    for (let result of results) {
        const app = {
            "id": result.id,
            "key": result.id,
            "date": new Date(result.meta["submissionDate"].toDate()).toDateString(),
            "orgName": result.submission["orgName"],
            "primaryName": result.submission["primaryName"],
            "appType": result.submission["sponsorshipSelect"],
            "appLink" : `${match.path}/${result.id}`,
            "currentSponsorship": result
        };

        if(result.admin.approvalStatus === "pending") {
            app["activeTab"] = "pending";
            pendingApplications.push(app);
        } else if(result.admin.approvalStatus === "approved") {
            app["activeTab"] = "approved";
            approvedApplications.push(app);
        } if(result.admin.approvalStatus === "denied") {
            app["activeTab"] = "denied";
            deniedApplications.push(app);
        }

        applications.push(app);

    }

    if (applications.length) {
        let applicationInfo = new applicationsData(applications.length, applications);
        const pendingApplicationInfo = new applicationsData(pendingApplications.length, pendingApplications);
        const approvedApplicationInfo = new applicationsData(approvedApplications.length, approvedApplications);
        const deniedApplicationInfo = new applicationsData(deniedApplications.length, deniedApplications);

        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <LayoutContent ref={target}>
                    <div className="dummy-data-buttons" style={{textAlign: 'right'}}>
                        <Space>
                            <Button onClick={(e) => {insertDummyData("Monetary")}} type="primary">Dummy Monetary</Button>
                            <Button onClick={(e) => {insertDummyData("Material")}}>Dummy Material</Button>
                        </Space>
                    </div>
                    <Tabs className="isoTableDisplayTab" onChange={onTabChange} defaultActiveKey={activeTab}>
                        {sponsorshipTabs.map(tab => {
                            if (tab.value === 'pending') {
                                if (pendingApplicationInfo.applicationData.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={sponsorshipColumns[0]}
                                                dataList={pendingApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentSponsorship={pendingApplicationInfo.currentSponsorship}
                                            />
                                        </TabPane>
                                    )
                                } else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Pending Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            } else if (tab.value === 'approved') {
                                if (approvedApplicationInfo.applicationData.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={sponsorshipColumns[0]}
                                                dataList={approvedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentSponsorship={applicationInfo.currentSponsorship}
                                            />
                                        </TabPane>
                                    )
                                } else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Approved Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            } else if (tab.value === 'denied') {
                                if (deniedApplicationInfo.applicationData.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={sponsorshipColumns[0]}
                                                dataList={deniedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentSponsorship={deniedApplicationInfo.currentSponsorship}
                                            />
                                        </TabPane>
                                    )
                                } else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Denied Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }
                        })}
                    </Tabs>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    } else {
        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <LayoutContent className={"ant-spin-nested-loading"}>
                    <TableWrapper
                    loading={true}/>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const sortOption = {};
class applicationsData {
    constructor(size, applicationData) {
        this.size = size || 2000;
        this.datas = [];
        this.sortKey = null;
        this.sortDir = null;
        this.applicationData = applicationData;
    }
    dataModel(index) {
        return this.applicationData[index];
    }
    getObjectAt(index) {
        if (index < 0 || index > this.size) {
            return undefined;
        }
        if (this.datas[index] === undefined) {
            this.datas[index] = this.dataModel(index);
        }
        return this.datas[index];
    }
    getAll() {
        if (this.datas.length < this.size) {
            for (let i = 0; i < this.size; i++) {
                this.getObjectAt(i);
            }
        }
        return this.datas.slice();
    }

    getSize() {
        return this.size;
    }
    getSortAsc(sortKey) {
        sortOption.sortKey = sortKey;
        sortOption.sortDir = 'ASC';
        return this.datas.sort(this.sort);
    }
    getSortDesc(sortKey) {
        sortOption.sortKey = sortKey;
        sortOption.sortDir = 'DESC';
        return this.datas.sort(this.sort);
    }
    sort(optionA, optionB) {
        const valueA = optionA[sortOption.sortKey].toUpperCase();
        const valueB = optionB[sortOption.sortKey].toUpperCase();
        let sortVal = 0;
        if (valueA > valueB) {
            sortVal = 1;
        }
        if (valueA < valueB) {
            sortVal = -1;
        }
        if (sortVal !== 0 && sortOption.sortDir === 'DESC') {
            return sortVal * -1;
        }
        return sortVal;
    }
}
