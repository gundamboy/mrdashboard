import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {useDispatch, useSelector} from "react-redux";
import * as TableViews from '../Tables/AntTables/TableViews/TableViews';
import Tabs, {TabPane} from "@iso/components/uielements/tabs";
import {scholarshipTabs} from "./tableConfig";
import {Space, Input, Tooltip, Select, Form} from "antd";
import {SearchOutlined, SettingFilled, FileExcelOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import TableWrapper from "../Tables/AntTables/AntTables.styles";
import {Link, useRouteMatch} from "react-router-dom";
import Button from "@iso/components/uielements/button";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {AdvancedOptions, AdvancedOptionsWrapper} from "./Scholarships.styles";
import scholarshipsActions from "../../redux/scholarships/actions";
import {compareByAlpha, compareScore, formattedDate, getCurrentYear} from "../../helpers/shared";
import {ExportScholarships} from "../../helpers/exportScholarships";

const {
    fetchScholarshipsStart
} = scholarshipsActions;

export default function Scholarships() {
    const {scholarships, loading, activeScholarshipsTab, scholarshipTableSorter, scholarshipYear, users} = useSelector(
        state => state.Scholarships);
    const [showOptionsClass, setShowOptionsClass] = useState();
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const searchInput = useRef(null);
    let Component = TableViews.SortView;
    const { Option } = Select;

    // this is like componentDidMount but its for a function component and not a class
    useEffect(() => {
        console.log("userEffect scholarshipYear:", scholarshipYear);
        dispatch(fetchScholarshipsStart(scholarshipYear));
    }, [dispatch]);

    const toggleAdvancedOptions = () => {
        if (!showOptionsClass) {
            setShowOptionsClass("show");
        } else {
            setShowOptionsClass("");
        }
    };

    const getUserName = uid => {
        for(const user of users) {
            if(user.id === uid) {
                return user.name;
            }
        }
    };

    // dispatches the setActiveTab action in the actions.js file
    const setTab = useCallback(
        (currentTab) => dispatch(scholarshipsActions.setActiveTab(currentTab)),
        [dispatch]
    );

    const setYear = useCallback(
        (scholarshipYear) => dispatch(scholarshipsActions.setScholarshipYear(scholarshipYear)),
        [dispatch]
    );

    // calls SetTab
    const onTabChange = (key) => {
        setTab(key)
    };

    const handleYearChange = (year) => {
        setYear(year);
    }

    const onYearFormFinish = () => {}

    console.log("state:", useSelector(
        state => state.Scholarships))

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

    // returns an object used for the table columns with or without default sorting based on redux state
    const getColumnData = (title, key) => {
        let columnObj = {}

        if(scholarshipTableSorter !== undefined && scholarshipTableSorter.column !== undefined) {
            if(scholarshipTableSorter.columnKey === key) {

                const col = scholarshipTableSorter.column;
                const field = col.key;


                if(key === "score") {
                    columnObj = {
                        title: title,
                        key: key,
                        dataIndex: key,
                        sortOrder: scholarshipTableSorter.order,
                        sorter: (a, b) => compareScore(a[field], b[field]),
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps(key),
                    };
                } else if(key === "started") {
                    columnObj = {
                        title: title,
                        key: key,
                        dataIndex: key,
                        sorter: (a, b) => new Date(a.started) - new Date(b.started),
                        defaultSortOrder: 'descend',
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps(key),
                    };
                } else if(key === "finished") {
                    columnObj = {
                        title: title,
                        key: key,
                        dataIndex: key,
                        sorter: (a, b) => new Date(a.started) - new Date(b.started),
                        render: text => <p>{text}</p>,
                        ...getColumnSearchProps(key),
                    };
                } else {
                    columnObj = {
                        title: title,
                        key: key,
                        dataIndex: key,
                        sortOrder: scholarshipTableSorter.order,
                        sorter: (a, b) => compareByAlpha(a[field], b[field]),
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

    const getTotalScore = (points) => {
        let total = 0;
        const pointKeys = Object.keys(points);

        for (let i = 0; i < pointKeys.length; i++) {
            total += points[pointKeys[i]];
        }

        return total;

    }

    const buildYearSelectOptions = () => {
        let years = [];

        for(let i = 2020; i <= getCurrentYear(); i++) {
            years.push(i.toString());
        }

        years.reverse();

        return (
            <>
            {years.map((value, index) => {
                    return <Option key={index} value={value}>{value}</Option>
                })}
            </>
        )
    };

    if(scholarships) {
        let pendingDccScholarships = [];
        let pendingEduScholarships = [];
        let completedDccScholarships = [];
        let completedEduScholarships = [];
        let approvedScholarships = [];
        let deniedScholarships = [];
        let eligibleScholarships = [];
        let ineligibleScholarships = [];
        let pendingDccScholarshipsInfo = null;
        let pendingEduScholarshipsInfo = null;
        let approvedScholarshipsInfo = null;
        let deniedScholarshipsInfo = null;
        let completedDccScholarshipsInfo = null;
        let completedEduScholarshipsInfo = null;

        let deniedDccScholarships = [];
        let deniedEduScholarships = [];
        let approvedDccScholarships = [];
        let approvedEduScholarships = [];

        let approvedDccScholarshipsInfo = [];
        let deniedDccScholarshipsInfo = [];
        let approvedEduScholarshipsInfo = [];
        let deniedEduScholarshipsInfo = [];
        let eligibleScholarshipsInfo = [];
        let ineligibleScholarshipsInfo = [];
        // array of columns for table
        const scholarshipColumnsPending = [
            {
                columns: [
                    {
                        ...getColumnData("Stared Date", "started"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Name", "name")
                    },
                    {
                        ...getColumnData("Email", "email")
                    },
                    {
                        ...getColumnData("City", "city")
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
        ];

        // array of columns for table
        const scholarshipColumnsCompleted = [
            {
                columns: [
                    {
                        ...getColumnData("Stared Date", "started"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Finished Date", "finished"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Name", "name")
                    },
                    {
                        ...getColumnData("Email", "email")
                    },
                    {
                        ...getColumnData("City", "city")
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

        const scholarshipColumnsApproveDeny = [
            {
                columns: [
                    {
                        ...getColumnData("Stared Date", "started"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Finished Date", "finished"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Name", "name")
                    },
                    {
                        ...getColumnData("Email", "email")
                    },
                    {
                        ...getColumnData("City", "city")
                    },
                    {
                        ...getColumnData("App Type", "appType")
                    },
                    {
                        ...getColumnData("Score", "score")
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

        const scholarshipColumnsEligible = [
            {
                columns: [
                    {
                        ...getColumnData("Stared Date", "started"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Finished Date", "finished"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Name", "name")
                    },
                    {
                        ...getColumnData("Email", "email")
                    },
                    {
                        ...getColumnData("City", "city")
                    },
                    {
                        ...getColumnData("App Type", "appType")
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

        const scholarshipColumnsIneligible = [
            {
                columns: [
                    {
                        ...getColumnData("Stared Date", "started"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Finished Date", "finished"),
                        width: "12%",
                    },
                    {
                        ...getColumnData("Name", "name")
                    },
                    {
                        ...getColumnData("Email", "email")
                    },
                    {
                        ...getColumnData("City", "city")
                    },
                    {
                        ...getColumnData("App Type", "appType")
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

        // makes the actual data the table displays
        for (const [i, scholarship] of scholarships.entries()) {
            const dccApp = scholarship.dcc;
            const eduApp = scholarship.higherEdu;
            let approvalStatus = "pending";
            const firebaseDates = scholarship.dates;
            const dccStartDate = firebaseDates.dcc.started !== "" ? formattedDate(firebaseDates.dcc.started.toDate()) : "";
            const eduStartDate = firebaseDates.higherEdu.started !== "" ? formattedDate(firebaseDates.higherEdu.started.toDate()) : "";
            const dccFinishedDate = firebaseDates.dcc.finished !== "" ? formattedDate(firebaseDates.dcc.finished.toDate()) : "";
            const eduFinishedDate = firebaseDates.higherEdu.finished !== "" ? formattedDate(firebaseDates.higherEdu.finished.toDate()) : "";

            if (scholarshipYear === "2020") {
                if (i === 0) {
                    console.log(
                        "firebaseDates:", firebaseDates, " || \n\r",
                        "dccStartDate:", dccStartDate, " || \n\r",
                        "eduStartDate:", eduStartDate, " || \n\r",
                        "dccFinishedDate:", dccFinishedDate, " || \n\r",
                        "eduFinishedDate:", eduFinishedDate, " || \n\r",
                    )
                }
                if(scholarship.hasOwnProperty("approvals")) {
                    if(scholarship.approvals.hasOwnProperty("higherEduEmailSent") || scholarship.approvals.hasOwnProperty("dccEmailSent")) {
                        approvalStatus = "approved";
                    } else {
                        approvalStatus = "denied";
                    }
                }
            } else {
                approvalStatus = scholarship.admin.approvalStatus;
            }

            // pending dcc
            if (!firebaseDates.dcc.finished && firebaseDates.dcc.started && approvalStatus.dcc === "pending") {
                pendingDccScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "started": dccStartDate,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }
            // completed dcc
            if (firebaseDates.dcc.finished && approvalStatus.dcc === "pending") {
                completedDccScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "started": dccFinishedDate,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "finished": dccFinishedDate,
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }
            // pending edu
            if (!firebaseDates.higherEdu.finished && firebaseDates.higherEdu.started && approvalStatus.higherEdu === "pending") {
                pendingEduScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "started": eduStartDate,
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });
            }
            // completed edu
            if (firebaseDates.higherEdu.finished && approvalStatus.higherEdu === "pending") {
                completedEduScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "started": eduFinishedDate,
                    "finished": eduFinishedDate,
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });
            }

                //Eligibility
            if(firebaseDates.higherEdu.finished && approvalStatus.higherEdu === "eligible") {
                eligibleScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "started": eduFinishedDate,
                    "finished": eduFinishedDate,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });
            }

            if(firebaseDates.dcc.finished && approvalStatus.dcc === "eligible") {
                eligibleScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }

            if(firebaseDates.higherEdu.finished && approvalStatus.higherEdu === "ineligible") {
                ineligibleScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });
            }

            if(firebaseDates.dcc.finished && approvalStatus.dcc === "ineligible") {
                ineligibleScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }

            // approved
            if (approvalStatus.dcc === "approved") {
                approvedScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });

                approvedDccScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }

            if (approvalStatus.higherEdu === "approved") {
                approvedScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });

                approvedEduScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });
            }

            // denied
            if (approvalStatus.dcc === "denied") {
                deniedScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });

                deniedDccScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": dccApp.name ? dccApp.name : getUserName(scholarship.id)+"*",
                    "email": dccApp.email,
                    "city": dccApp.city,
                    "appType": "DCC",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/dcc`,
                    "currentScholarship": scholarship,
                });
            }

            if (approvalStatus.higherEdu === "denied") {
                deniedScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
                });

                deniedEduScholarships.push({
                    "id": scholarship.id,
                    "key": scholarship.id,
                    "name": eduApp.name ? eduApp.name : getUserName(scholarship.id)+"*",
                    "email": eduApp.email,
                    "city": eduApp.city,
                    "appType": "Higher Edu",
                    "score": getTotalScore(scholarship.admin.grades.points),
                    "appLink": `${match.path}/${scholarship.id}/higherEdu`,
                    "currentScholarship": scholarship,
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

        approvedDccScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        deniedDccScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        approvedEduScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        deniedEduScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        eligibleScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);
        ineligibleScholarships.sort((a, b) => (a.name > b.name) ? 1 : -1);

        pendingDccScholarshipsInfo = new applicationsData(pendingDccScholarships.length, pendingDccScholarships);
        pendingEduScholarshipsInfo = new applicationsData(pendingEduScholarships.length, pendingEduScholarships);

        completedDccScholarshipsInfo = new applicationsData(completedDccScholarships.length, completedDccScholarships);
        completedEduScholarshipsInfo = new applicationsData(completedEduScholarships.length, completedEduScholarships);

        approvedScholarshipsInfo = new applicationsData(approvedScholarships.length, approvedScholarships);

        approvedDccScholarshipsInfo = new applicationsData(approvedDccScholarships.length, approvedDccScholarships);
        deniedDccScholarshipsInfo = new applicationsData(deniedDccScholarships.length, deniedDccScholarships);

        approvedEduScholarshipsInfo = new applicationsData(approvedEduScholarships.length, approvedEduScholarships);
        deniedEduScholarshipsInfo = new applicationsData(deniedEduScholarships.length, deniedEduScholarships);

        ineligibleScholarshipsInfo = new applicationsData(ineligibleScholarships.length, ineligibleScholarships);
        eligibleScholarshipsInfo = new applicationsData(eligibleScholarships.length, eligibleScholarships);

        return (
            <LayoutContentWrapper style={{height: '100%'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.scholarships"/>
                </PageHeader>

                <LayoutContent ref={target}>
                    <AdvancedOptionsWrapper className="advanced-options-wrapper">
                        <div className="year-swap">
                            <span className={"year-swap-label"}>Scholarship Year</span>
                            <Select defaultValue={scholarshipYear} style={{ width: 120 }} onChange={handleYearChange}>
                                {buildYearSelectOptions()}
                            </Select>
                        </div>
                        <AdvancedOptions className={"advanced-options " + showOptionsClass}>
                            <div className="export-buttons" style={{textAlign: 'right'}}>
                                <Button type="link" onClick={(e) => {ExportScholarships(pendingDccScholarshipsInfo, pendingEduScholarshipsInfo,
                                    completedDccScholarshipsInfo, completedEduScholarshipsInfo,
                                    approvedDccScholarshipsInfo, deniedDccScholarshipsInfo, approvedEduScholarshipsInfo, deniedEduScholarshipsInfo )}}>Export Scholarships</Button>
                            </div>
                        </AdvancedOptions>
                        <div className="options" style={{textAlign: "right"}}>
                            <Tooltip title="Advanced Options" mouseEnterDelay={0.65}>
                                <Button style={{border: "none"}} shape="circle"
                                        icon={<SettingFilled style={{fontSize: 22}} onClick={toggleAdvancedOptions}/>}/>
                            </Tooltip>
                        </div>
                    </AdvancedOptionsWrapper>

                    <Tabs className="isoTableDisplayTab" onChange={onTabChange} defaultActiveKey={activeScholarshipsTab}>
                        {scholarshipTabs.map(tab => {
                            if(tab.value === 'pendingDcc') {
                                if(pendingDccScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
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
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
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
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
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
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
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

                            if(tab.value === 'approvedDcc') {
                                if(approvedDccScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
                                                tableInfo={scholarshipColumnsApproveDeny[0]}
                                                dataList={approvedDccScholarshipsInfo}
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

                            if(tab.value === 'approvedEdu') {
                                if(approvedEduScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
                                                tableInfo={scholarshipColumnsApproveDeny[0]}
                                                dataList={approvedEduScholarshipsInfo}
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

                            if(tab.value === 'deniedDcc') {
                                if(deniedDccScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
                                                tableInfo={scholarshipColumnsApproveDeny[0]}
                                                dataList={deniedDccScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={deniedDccScholarshipsInfo.currentScholarship}
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

                            if(tab.value === 'deniedEdu') {
                                if(deniedEduScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                currentTab={tab.value}
                                                tableInfo={scholarshipColumnsApproveDeny[0]}
                                                dataList={deniedEduScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={deniedEduScholarshipsInfo.currentScholarship}
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

                            if(tab.value === 'eligible') {
                                if(eligibleScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                tableInfo={scholarshipColumnsEligible[0]}
                                                dataList={eligibleScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={eligibleScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No ineligible applications at this time.</p>
                                        </TabPane>
                                    )
                                }
                            }

                            if(tab.value === 'ineligible') {
                                if(ineligibleScholarships.length) {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <Component
                                                parentPage={"scholarships"}
                                                tableInfo={scholarshipColumnsIneligible[0]}
                                                dataList={ineligibleScholarshipsInfo}
                                                bordered={true}
                                                size={"small"}
                                                loading={loading}
                                                expandable={false}
                                                pagination={{hideOnSinglePage: true}}
                                                currentScholarship={ineligibleScholarshipsInfo.currentScholarship}
                                            />
                                        </TabPane>
                                    )
                                }  else {
                                    return (
                                        <TabPane tab={tab.title} key={tab.value}>
                                            <p>No ineligible applications at this time.</p>
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
        let valueA = optionA[sortOption.sortKey];
        let valueB = optionB[sortOption.sortKey];

        if(typeof optionA[sortOption.sortKey] === "string") {
            valueA = optionA[sortOption.sortKey].toUpperCase();
            valueB = optionB[sortOption.sortKey].toUpperCase();
        }


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