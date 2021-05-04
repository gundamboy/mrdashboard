import React, {useState, useCallback, useRef} from 'react';
import ReactDomServer from 'react-dom/server';
import { useDispatch } from 'react-redux';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import {Alert, Row, Col, Button, Form, Select, Input, Space, Typography, Divider, Checkbox, Modal} from 'antd';
import {MinusCircleOutlined, PlusOutlined, UnderlineOutlined} from '@ant-design/icons';
import * as firebase from "firebase";
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";

export default function(props) {

}