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

export default function Grants() {
    let applications = [], pendingApplications = [], approvedApplications = [], deniedApplications = [];
    let Component = TableViews.SortView;
    const {grants, grantsLoading, grantsActiveTab, grantTableSorter}  = useSelector(state => state.grantsReducer);
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const target = useRef(null);
    const searchInput = useRef(null);


}