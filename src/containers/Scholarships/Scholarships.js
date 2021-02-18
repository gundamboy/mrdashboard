import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {useDispatch, useSelector} from "react-redux";
import * as TableViews from '../Tables/AntTables/TableViews/TableViews';
import Tabs, {TabPane} from "@iso/components/uielements/tabs";
import {scholarshipTabs} from "./tableConfig";
import {Space, Spin, Input, Tooltip, Alert} from "antd";
import {SearchOutlined, SettingFilled, FileExcelOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import {Link, useRouteMatch} from "react-router-dom";
import Button from "@iso/components/uielements/button";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {AdvancedOptions, AdvancedOptionsWrapper} from "./Scholarships.styles";
import scholarshipsActions from "../../redux/scholarships/actions";
import {formattedDate} from "../../helpers/shared";
import {ExportScholarships} from "../../helpers/exportScholarships";

const {
    fetchScholarshipsStart
} = scholarshipsActions;

export default function Scholarships() {
    const {scholarships, loading, activeTab, users} = useSelector(
        state => state.Scholarships);
    const [showOptionsClass, setShowOptionsClass] = useState();
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const [filteredInfo, setFilteredInfo] = useState();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const searchInput = useRef(null);
    let Component = TableViews.SortView;

    // this is like componentDidMount but its for a function component and not a class
    useEffect(() => {
        dispatch(fetchScholarshipsStart());
    }, [dispatch]);

    const toggleAdvancedOptions = () => {
        if (!showOptionsClass) {
            setShowOptionsClass("show");
        } else {
            setShowOptionsClass("");
        }
    };

    // dispatches the setActiveTab action in the actions.js file
    const setTab = useCallback(
        (currentTab) => dispatch(scholarshipsActions.setActiveTab(currentTab)),
        [dispatch]
    );

    // calls SetTab
    const onTabChange = (key) => {
        setTab(key)
    };

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

    if(scholarships) {
        let pendingDccScholarships = [];
        let pendingEduScholarships = [];
        let completedDccScholarships = [];
        let completedEduScholarships = [];
        let approvedScholarships = [];
        let deniedScholarships = [];
        let pendingDccScholarshipsInfo = null;
        let pendingEduScholarshipsInfo = null;
        let approvedScholarshipsInfo = null;
        let deniedScholarshipsInfo = null;
        let completedDccScholarshipsInfo = null;
        let completedEduScholarshipsInfo = null;

        // TODO: do not put apps in the list if they are totally blank?
        const scholarshipColumnsPending = [
            {
                columns: [
                    {
                        title: "Name",
                        key: "name",
                        dataIndex: "name",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('name'),
                    },
                    {
                        title: "Email",
                        key: "email",
                        dataIndex: "email",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('email'),
                    },
                    {
                        title: "City",
                        key: "city",
                        dataIndex: "city",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('city'),
                    },
                    {
                        title: "Started",
                        key: "started",
                        dataIndex: "started",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('started'),
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
                        )
                    }
                ]
            }
        ]

        const scholarshipColumnsCompleted = [
            {
                columns: [
                    {
                        title: "Name",
                        key: "name",
                        dataIndex: "name",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('name'),
                    },
                    {
                        title: "Email",
                        key: "email",
                        dataIndex: "email",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('email'),
                    },
                    {
                        title: "City",
                        key: "city",
                        dataIndex: "city",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('city'),
                    },
                    {
                        title: "Started",
                        key: "started",
                        dataIndex: "started",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('started'),
                    },
                    {
                        title: "Finished",
                        key: "finished",
                        dataIndex: "finished",
                        sorter: true,
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps('finished'),
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
                        )
                    }
                ]
            }
        ]

        for (let scholarship of scholarships) {

                const dccApp = scholarship.dcc;
                const eduApp = scholarship.higherEdu;
                const admin = scholarship.admin.approvalStatus;
                const adminDcc = admin.dcc;
                const adminEdu = admin.higherEdu;
                const firebaseDates = scholarship.dates;
                const dccStartDate = firebaseDates.dcc.started !== "" ? formattedDate(firebaseDates.dcc.started.toDate()) : "";
                const eduStartDate = firebaseDates.higherEdu.started !== "" ? formattedDate(firebaseDates.higherEdu.started.toDate()) : "";
                const dccFinishedDate = firebaseDates.dcc.finished !== "" ? formattedDate(firebaseDates.dcc.finished.toDate()) : "";
                const eduFinishedDate = firebaseDates.higherEdu.finished !== "" ? formattedDate(firebaseDates.higherEdu.finished.toDate()) : "";
                // pending dcc
                if (!firebaseDates.dcc.finished && firebaseDates.dcc.started) {
                    pendingDccScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": dccApp.name,
                        "email": dccApp.email,
                        "city": dccApp.city,
                        "started": dccStartDate,
                        "appLink": `${match.path}/${scholarship.id}/dcc`,
                        "currentScholarship": scholarship
                    });
                }
                // completed dcc
                if (firebaseDates.dcc.finished) {
                    completedDccScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": dccApp.name,
                        "email": dccApp.email,
                        "city": dccApp.city,
                        "started": dccFinishedDate,
                        "finished": dccFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/dcc`,
                        "currentScholarship": scholarship
                    });
                }
                // pending edu
                if (!firebaseDates.higherEdu.finished && firebaseDates.higherEdu.started) {
                    pendingEduScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": eduApp.name,
                        "email": eduApp.email,
                        "city": eduApp.city,
                        "started": eduStartDate,
                        "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                        "currentScholarship": scholarship
                    });
                }
                // completed edu
                if (firebaseDates.higherEdu.finished) {
                    completedEduScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": eduApp.name,
                        "email": eduApp.email,
                        "city": eduApp.city,
                        "started": eduFinishedDate,
                        "finished": eduFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                        "currentScholarship": scholarship
                    });
                }
                // approved
                if (firebaseDates.dcc.finished && adminDcc.approvalStatus === "approved") {
                    approvedScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": dccApp.name,
                        "email": dccApp.email,
                        "city": dccApp.city,
                        "started": dccFinishedDate,
                        "finished": dccFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/dcc`,
                        "currentScholarship": scholarship
                    });
                }
                // approved
                if (firebaseDates.higherEdu.finished && adminEdu.approvalStatus === "approved") {
                    approvedScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": eduApp.name,
                        "email": eduApp.email,
                        "city": eduApp.city,
                        "started": eduFinishedDate,
                        "finished": eduFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                        "currentScholarship": scholarship
                    });
                }
                // denied
                if (firebaseDates.dcc.finished && adminDcc.approvalStatus === "denied") {
                    deniedScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": dccApp.name,
                        "email": dccApp.email,
                        "city": dccApp.city,
                        "started": dccFinishedDate,
                        "finished": dccFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/dcc`,
                        "currentScholarship": scholarship
                    });
                }
                // denied
                if (firebaseDates.higherEdu.finished && adminEdu.approvalStatus === "denied") {
                    deniedScholarships.push({
                        "id": scholarship.id,
                        "key": scholarship.id,
                        "name": eduApp.name,
                        "email": eduApp.email,
                        "city": eduApp.city,
                        "started": eduFinishedDate,
                        "finished": eduFinishedDate,
                        "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                        "currentScholarship": scholarship
                    });
                }
            }


        // sort by date by default
        pendingDccScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        pendingEduScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        completedDccScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        completedEduScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        approvedScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        deniedScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        pendingDccScholarshipsInfo = new applicationsData(pendingDccScholarships.length, pendingDccScholarships);
        pendingEduScholarshipsInfo = new applicationsData(pendingEduScholarships.length, pendingEduScholarships);
        completedDccScholarshipsInfo = new applicationsData(completedDccScholarships.length, completedDccScholarships);
        completedEduScholarshipsInfo = new applicationsData(completedEduScholarships.length, completedEduScholarships);
        approvedScholarshipsInfo = new applicationsData(approvedScholarships.length, approvedScholarships);
        deniedScholarshipsInfo = new applicationsData(deniedScholarships.length, deniedScholarships);

        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.scholarships"/>
                </PageHeader>

                <LayoutContent ref={target}>

                    <Alert message="This is a preview and is not production ready." type="error" />

                    <AdvancedOptionsWrapper className="advanced-options-wrapper">
                        <AdvancedOptions className={"advanced-options " + showOptionsClass}>
                            <div className="export-buttons" style={{textAlign: 'right'}}>
                                <Button type="link" onClick={(e) => {ExportScholarships(pendingDccScholarshipsInfo, pendingEduScholarshipsInfo,
                                    completedDccScholarshipsInfo, completedEduScholarshipsInfo,
                                    approvedScholarshipsInfo, deniedScholarshipsInfo)}}>Export Scholarships</Button>
                            </div>
                        </AdvancedOptions>
                        <div className="options" style={{textAlign: "right"}}>
                            <Tooltip title="Advanced Options" mouseEnterDelay={0.65}>
                                <Button style={{border: "none"}} shape="circle"
                                        icon={<SettingFilled style={{fontSize: 22}} onClick={toggleAdvancedOptions}/>}/>
                            </Tooltip>
                        </div>
                    </AdvancedOptionsWrapper>

                    <Tabs className="isoTableDisplayTab" onChange={onTabChange} defaultActiveKey={activeTab}>
                        {scholarshipTabs.map(tab => {
                            if(tab.value === 'pendingDcc') {
                                if(pendingDccScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsPending[0]}
                                                dataList={pendingDccScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={pendingDccScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Applications have been started at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'pendingEdu') {
                                if(pendingEduScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsPending[0]}
                                                dataList={pendingEduScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={pendingEduScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Applications have been started at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'completedDcc') {
                                if(completedDccScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsCompleted[0]}
                                                dataList={completedDccScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={completedDccScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Completed Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'completedEdu') {
                                if(completedEduScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsCompleted[0]}
                                                dataList={completedEduScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={completedEduScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Completed Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'approved') {
                                if(approvedScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsCompleted[0]}
                                                dataList={approvedScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={approvedScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No Approved Applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'denied') {
                                if(deniedScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                tableInfo={scholarshipColumnsCompleted[0]}
                                                dataList={deniedScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={deniedScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
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
        )
    } else {
        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.scholarships" />
                </PageHeader>
                <LayoutContent className={"ant-spin-nested-loading"}>
                    <TableWrapper loading={true}/>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }

    console.groupEnd();
};

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