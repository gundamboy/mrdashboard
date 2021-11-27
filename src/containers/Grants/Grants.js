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
import {compareByAlpha, formattedDate, production} from "../../helpers/shared";
import { grantTabs } from "../Tables/AntTables/configs";
import grantsActions from "../../redux/grants/actions";
import {AdvancedOptionsWrapper} from "./Grants.styles";
import {AdvancedOptions} from "../Sponsorships/Sponsorships.styles";
import {ExportSponsorships} from "../../helpers/exportSponsorships";
import {ExportGrants} from "../../helpers/exportGrants";

export default function Grants() {
    let applications = [], pendingApplications = [], approvedApplications = [], deniedApplications = [],
        grantsTableSorter;
    let Component = TableViews.SortView;
    const {grants, grantsLoading, grantsActiveTab, grantTableSorter}  = useSelector(state => state.grantsReducer);
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const [showOptionsClass, setShowOptionsClass] = useState();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const searchInput = useRef(null);

    //console.log("state:",  useSelector(state => state.grantsReducer));

    // fetch grants start
    const getGrantApplications = useCallback(
        () => dispatch(grantsActions.fetchGrantsStart()),
        [dispatch]
    );

    // set the active tab
    const setTab  = useCallback(
        (currentTab) => dispatch(grantsActions.setGrantActiveTab((currentTab))),
        [dispatch],
    );

    // userEffect call fetch referrals start
    useEffect(() => {
        getGrantApplications();
    }, [dispatch]);

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

        if(grantsTableSorter !== undefined && grantsTableSorter.column !== undefined) {
            if(grantsTableSorter.columnKey === key) {
                const col = grantsTableSorter.column;
                const field = col.key;

                columnObj = {
                    title: title,
                    key: key,
                    dataIndex: key,
                    sortOrder: grantsTableSorter.order,
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
    for (let result of grants) {
        const app = {
            "id": result.id,
            "key": result.id,
            "date": formattedDate(new Date(result.submitted.toDate())),
            "name": result.organizationName,
            "amount": result.amountRequested,
            "appLink" : `${match.path}/${result.id}`,
            "currentApplication": result
        }

        if(result.grantsStatus === "pending") {
            pendingApplications.push(app);
        } else if(result.grantsStatus === "approved") {
            approvedApplications.push(app);
        } else if(result.grantsStatus === "denied") {
            deniedApplications.push(app);
        }

        applications.push(app);
    }

    const grantColumns = [
        {
            columns: [
                {
                    ...getColumnData("Submission Date", "date"),
                    width: "12%",
                },
                {
                    ...getColumnData("Organization", "name")
                },
                {
                    ...getColumnData("Amount Requested", "amount")
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

    const toggleAdvancedOptions = () => {
        if (!showOptionsClass) {
            setShowOptionsClass("show");
        } else {
            setShowOptionsClass("");
        }
    };

    if(applications.length) {
        let applicationInfo = new applicationsData(applications.length, applications);
        const pendingApplicationInfo = new applicationsData(pendingApplications.length, pendingApplications);
        const approvedApplicationInfo = new applicationsData(approvedApplications.length, approvedApplications);
        const deniedApplicationInfo = new applicationsData(deniedApplications.length, deniedApplications);

        return (
            <LayoutContentWrapper style={{height: '100%'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.grants" />
                </PageHeader>
                <LayoutContent ref={target} className={"ant-spin-nested-loading"}>
                    <AdvancedOptionsWrapper className="advanced-options-wrapper">
                        <AdvancedOptions className={"advanced-options " + showOptionsClass}>
                            <div className="dummy-data-buttons" style={{textAlign: 'right'}}>
                                <Space>
                                    <Button type="link" onClick={(e) => {ExportGrants(grants)}}>Export Sponsorships</Button>
                                </Space>
                            </div>
                        </AdvancedOptions>
                        <div className="options" style={{textAlign: "right"}}>
                            <Tooltip title="Advanced Options" mouseEnterDelay={0.65}>
                                <Button style={{border: "none"}} shape="circle" icon={<SettingFilled style={{fontSize: 22}} onClick={toggleAdvancedOptions}/>}/>
                            </Tooltip>
                        </div>
                    </AdvancedOptionsWrapper>

                    <Tabs className="isoTableDisplayTab" onChange={onTabChange} defaultActiveKey={grantsActiveTab}>
                        {grantTabs.map(tab => {
                            if (tab.value === 'pending') {
                                if (pendingApplicationInfo.applicationData.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"grants"}
                                                tableInfo={grantColumns[0]}
                                                dataList={pendingApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={grantsLoading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentApplication={pendingApplicationInfo.currentApplication}
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
                                                parentPage={"grants"}
                                                tableInfo={grantColumns[0]}
                                                dataList={approvedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={grantsLoading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentApplication={approvedApplicationInfo.currentApplication}
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
                                                parentPage={"grants"}
                                                tableInfo={grantColumns[0]}
                                                dataList={deniedApplicationInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={grantsLoading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentApplication={deniedApplicationInfo.currentApplication}
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
                    <IntlMessages id="sidebar.grants" />
                </PageHeader>
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