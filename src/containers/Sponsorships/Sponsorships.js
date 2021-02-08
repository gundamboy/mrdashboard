import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {useDispatch, useSelector} from "react-redux";
import sponsorshipActions from "../../redux/sponsorships/actions";
import sponsorshipsReducer from "../../redux/sponsorships/reducer";
import * as TableViews from '../Tables/AntTables/TableViews/TableViews';
import Tabs, {TabPane} from "@iso/components/uielements/tabs";
import { sponsorshipTabs} from "../Tables/AntTables/configs";
import {Space, Spin, Input, Tooltip } from "antd";
import {SearchOutlined, SettingFilled, FileExcelOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import {Link, useRouteMatch} from "react-router-dom";
import Button from "@iso/components/uielements/button";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {AdvancedOptions, AdvancedOptionsWrapper} from "./Sponsorships.styles";
import {ExportSponsorships} from "../../helpers/exportSponsorships";
import {formattedDate} from "../../helpers/shared";


export default function Sponsorships(props) {
    const production = true;
    let applications = [], pendingApplications = [], approvedApplications = [], deniedApplications = [];
    let Component = TableViews.SortView;
    const { results, loading, error, appDeleted,
        emailSent, dataInserted, activeTab } = useSelector(state => state.sponsorshipsReducer);
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const [filteredInfo, setFilteredInfo] = useState();
    const [sortedInfo, setSortedInfo] = useState();
    const [showOptionsClass, setShowOptionsClass] = useState();
    const searchInput = useRef(null);

    // calls state from redux
    const getSponsorshipApplications = useCallback(
        () => dispatch(sponsorshipActions.fetchApplicationsStart()),
        [dispatch]
    );

    const setTab = useCallback(
        (currentTab) => dispatch(sponsorshipActions.setActiveTab(currentTab)),
        [dispatch]
    );

    // used to insert dummy data for testing
    const insertDummyData = useCallback(
        (dataType) => dispatch(sponsorshipActions.addDummyData(dataType)), [dispatch]
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

    // table search fields
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

    const handleTextSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleTextReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };

    const clearFilters = () => {
        setFilteredInfo(null);
    };

    // sets the currently selected tab in state
    const onTabChange = (key) => {
        setTab(key)
    };

    // build the data sets needed for the table in each tab
    for (let result of results) {
        const app = {
            "id": result.id,
            "key": result.id,
            "date": formattedDate(new Date(result.meta["submissionDate"].toDate())),
            "orgName": result.submission["orgName"],
            "primaryName": result.submission["primaryName"],
            "appType": result.submission["sponsorshipSelect"],
            "appLink" : `${match.path}/${result.id}`,
            "currentSponsorship": result
        };

        if(result.admin.approvalStatus === "pending") {
            pendingApplications.push(app);
        } else if(result.admin.approvalStatus === "approved") {
            approvedApplications.push(app);
        } if(result.admin.approvalStatus === "denied") {
            deniedApplications.push(app);
        }

        applications.push(app);

    }

    const sponsorshipColumns = [
        {
            columns: [
                {
                    title: "Submission Date",
                    key: "date",
                    dataIndex: "date",
                    sorter: true,
                    width: "12%",
                    render: data => <p>{data}</p>,
                    ...getColumnSearchProps('date'),
                },
                {
                    title: "Org Name",
                    key: "orgName",
                    dataIndex: "orgName",
                    sorter: true,
                    render: text => <p>{text}</p>,
                    ...getColumnSearchProps('orgName'),
                },
                {
                    title: "Primary Name",
                    key: "primaryName",
                    dataIndex: "primaryName",
                    sorter: true,
                    render: text => <p>{text}</p>,
                    ...getColumnSearchProps('primaryName'),
                },
                {
                    title: "Application Type",
                    key: "appType",
                    dataIndex: "appType",
                    width: 220,
                    sorter: true,
                    render: text => <p>{text}</p>,
                    filters: [
                        {text: "Material", value: "Material"},
                        {text: "Monetary", value: "Monetary"},
                    ],
                    onFilter: (value, record) => record.appType.includes(value),
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

    if (applications.length) {
        let applicationInfo = new applicationsData(applications.length, applications);
        const pendingApplicationInfo = new applicationsData(pendingApplications.length, pendingApplications);
        const approvedApplicationInfo = new applicationsData(approvedApplications.length, approvedApplications);
        const deniedApplicationInfo = new applicationsData(deniedApplications.length, deniedApplications);

        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.sponsorships" />
                </PageHeader>
                <LayoutContent ref={target}>
                    <AdvancedOptionsWrapper className="advanced-options-wrapper">
                        <AdvancedOptions className={"advanced-options " + showOptionsClass}>
                            {!production &&
                            <div className="dummy-data-buttons" style={{textAlign: 'right'}}>
                                <Space>
                                    <Button type="link" onClick={(e) => {ExportSponsorships(results)}}>Export Sponsorships</Button>
                                    <Button onClick={(e) => {insertDummyData("Monetary")}} type="primary">Add Dummy Monetary</Button>
                                    <Button onClick={(e) => {insertDummyData("Material")}}>Add Dummy Material</Button>
                                </Space>
                            </div>
                            }
                            {production &&
                            <div className="dummy-data-buttons" style={{textAlign: 'right'}}>
                                <Space>
                                    <Button type="link" icon={<FileExcelOutlined />} onClick={(e) => {ExportSponsorships(results)}}>Export Sponsorships</Button>
                                </Space>
                            </div>
                            }
                        </AdvancedOptions>
                        <div className="options" style={{textAlign: "right"}}>
                            <Tooltip title="Advanced Options" mouseEnterDelay={0.65}>
                                <Button style={{border: "none"}} shape="circle" icon={<SettingFilled style={{fontSize: 22}} onClick={toggleAdvancedOptions}/>}/>
                            </Tooltip>
                        </div>
                    </AdvancedOptionsWrapper>
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
                <PageHeader>
                    <IntlMessages id="sidebar.sponsorships" />
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
