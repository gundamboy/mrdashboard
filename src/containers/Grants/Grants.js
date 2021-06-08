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
import {compareByAlpha, formattedDate} from "../../helpers/shared";
import { grantTabs } from "../Tables/AntTables/configs";
import referralActions from "../../redux/referrals/actions";
import grantsActions from "../../redux/grants/actions";

export default function Grants() {
    let applications = [], pendingApplications = [], approvedApplications = [], deniedApplications = [],
        grantsTableSorter;
    let Component = TableViews.SortView;
    const {grants, grantsLoading, grantsActiveTab, grantTableSorter}  = useSelector(state => state.grantsReducer);
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const searchInput = useRef(null);

    // fetch grants start
    const getGrantApplications = useCallback(
        () => dispatch(grantsActions.fetchGrantsStart()), [dispatch]
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
    console.log("result:", grants);
    for (let result of grants) {
        const app = {
            "id": result.id,
            "key": result.id,
            "date": formattedDate(new Date(result.submitted.toDate())),
            "name": result.name,
            "amount": result.amount,
            "appLink" : `${match.path}/${result.id}`,
            "currentApplication": result
        }

        if(result.referralStatus === "pending") {
            pendingApplications.push(app);
        } else if(result.referralStatus === "approved") {
            approvedApplications.push(app);
        } else if(result.referralStatus === "denied") {
            deniedApplications.push(app);
        }

        applications.push(app);
    }





    if(applications.length) {
        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <PageHeader>
                    <IntlMessages id="sidebar.referrals" />
                </PageHeader>
                <LayoutContent className={"ant-spin-nested-loading"}>
                    <h3>it's working</h3>
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