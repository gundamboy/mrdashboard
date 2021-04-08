import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {useDispatch, useSelector} from "react-redux";
import * as TableViews from '../Tables/AntTables/TableViews/TableViews';
import Tabs, {TabPane} from "@iso/components/uielements/tabs";
import {Space, Spin, Input, Tooltip } from "antd";
import {SearchOutlined, SettingFilled, FileExcelOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import {Link, useRouteMatch} from "react-router-dom";
import Button from "@iso/components/uielements/button";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {formattedDate, compareByAlpha} from "../../helpers/shared";
import { referralTabs } from "../Tables/AntTables/configs";
import referralActions from "../../redux/referrals/actions";
import { ReferralSection } from "./Referrals.styles";
import {all} from "redux-saga/effects";

export default function Referrals(props) {
    // vars here
    const { referrals, referralsLoading,
        referralsActiveTab, referralTableSorter } = useSelector(state => state.referralsReducer);
    let allReferrals = [], pendingReferrals = [], approvedReferrals = [], deniedReferrals = [];
    let Component = TableViews.SortView;
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const searchInput = useRef(null);

    // fetch referrals start
    const getReferralApplications = useCallback(
        () => dispatch(referralActions.fetchReferralsStart()), [dispatch]
    );

    // set the active tab
    const setTab  = useCallback(
        (currentTab) => dispatch(referralActions.setReferralActiveTab((currentTab))),
        [dispatch],
    );

    // userEffect call fetch referrals start
    useEffect(() => {
        getReferralApplications();
    }, [getReferralApplications]);


    // table search stuff goes here
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleTextSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />

                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleTextSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleTextReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.focus(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    // returns an object used for the table columns with or without default sorting based on redux state
    const getColumnData = (title, key) => {
        let columnObj = {}

        if(referralTableSorter !== undefined && referralTableSorter.column !== undefined) {
            if(referralTableSorter.columnKey === key) {
                const col = referralTableSorter.column;
                const field = col.key;

                columnObj = {
                    title: title,
                    key: key,
                    dataIndex: key,
                    sortOrder: referralTableSorter.order,
                    sorter: (a, b) => compareByAlpha(a[field], b[field]),
                    render: text => <p>{text}</p>,
                    ...getColumnSearchProps(key),
                };
            } else {
                columnObj = {
                    title: title,
                    key: key,
                    dataIndex: key,
                    sorter: true,
                    render: text => <p>{text}</p>,
                    ...getColumnSearchProps(key),
                };
            }
        } else {
            columnObj = {
                title: title,
                key: key,
                dataIndex: key,
                sorter: true,
                render: text => <p>{text}</p>,
                ...getColumnSearchProps(key),
            };
        }

        return columnObj;
    }


    // table search text here
    const handleTextSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };


    //  table text search reset here
    const handleTextReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };


    // set on table change here
    const onTabChange = (key) => {
        setTab(key)
    };


    // for loop to build the data set for each tab
    for (let result of referrals) {
        const app = {
            "id": result.id,
            "key": result.id,
            "date": formattedDate(new Date(result.submitted.toDate())),
            "personYouAreReferring": result.personYouAreReferring,
            "referrerName": result.referrerName,
            "appLink" : `${match.path}/${result.id}`,
            "currentReferral": result
        }

        if(result.referralStatus === "pending") {
            pendingReferrals.push(app);
        } else if(result.referralStatus === "approved") {
            approvedReferrals.push(app);
        } else if(result.referralStatus === "denied") {
            deniedReferrals.push(app);
        }

        allReferrals.push(app);
    }


    // array of columns for the table
    const referralColumns = [
        {
            columns: [
                {
                    ...getColumnData("Submission Date", "date"),
                    width: "12%"
                },
                {
                    ...getColumnData("Referrer Name", "referrerName"),
                },
                {
                    ...getColumnData("Referee Name", "personYouAreReferring"),
                },
                {
                    title: "",
                    key: "appLink",
                    dataIndex: "appLink",
                    width: "6%",
                    render: url => (
                        <div className="">
                            <Link to={url}>
                                <Button className="applicationButton" color="primary">View</Button>
                            </Link>
                        </div>
                    ),
                }
            ]
        }
    ];


    if(allReferrals.length) {
        let applicationInfo = new applicationsData(allReferrals.length, allReferrals);
        const pendingApplicationInfo = new applicationsData(pendingReferrals.length, pendingReferrals);
        const approvedApplicationInfo = new applicationsData(approvedReferrals.length, approvedReferrals);
        const deniedApplicationInfo = new applicationsData(deniedReferrals.length, deniedReferrals);

        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.sponsorships" />
                </PageHeader>
                <LayoutContent ref={target}>
                    <Tabs className="isoTableDisplayTab" onChange={onTabChange} defaultActiveKey={referralsActiveTab}>
                        {referralTabs.map(tab => {
                            if (tab.value === 'pending') {
                                if (pendingApplicationInfo.applicationData.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"referrals"}
                                                tableInfo={referralColumns[0]}
                                                dataList={pendingApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={referralsLoading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentReferral={pendingApplicationInfo.currentReferral}
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
                                                parentPage={"referrals"}
                                                tableInfo={referralColumns[0]}
                                                dataList={approvedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={referralsLoading}
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
                                                parentPage={"referrals"}
                                                tableInfo={referralColumns[0]}
                                                dataList={deniedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={referralsLoading}
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
                <PageHeader>
                    <IntlMessages id="sidebar.referrals" />
                </PageHeader>
                <LayoutContent className={"ant-spin-nested-loading"}>
                    <TableWrapper
                        loading={true}/>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }

}


export const sortOption = {};
export class applicationsData {
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