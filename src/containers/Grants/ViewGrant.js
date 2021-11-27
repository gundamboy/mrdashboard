import React, {useState, useCallback, useRef} from 'react';
import ReactDomServer from 'react-dom/server';
import { useDispatch } from 'react-redux';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import {Alert, Row, Col, Button, Form, Select, Input, Space, Typography, Divider, Checkbox, Modal, Card} from 'antd';
import {MinusCircleOutlined, PlusOutlined, UnderlineOutlined} from '@ant-design/icons';
import * as firebase from "firebase";
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {ApplicationSection} from "./Grants.styles";
import ReactPlayer from "react-player"
import grantsActions from "../../redux/grants/actions";

export default function(props) {
    const editor = useRef(null);
    const [currentApp, setCurrentApp] = useState(props.currentGrant);
    const [editorState, setEditorState] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(props.currentGrant.grantsStatus);
    const dispatch = useDispatch();
    const { Option } = Select;
    const { Title } = Typography;
    let applicantEmailPreview = null;

    const formatAmountRequested = (amount) => {
        if(!amount.includes("$")) {
            return "$" + amount;
        } else {
            return amount;
        }
    }

    const getFormattedSubmittedDate = () => {
        const month = currentApp.submitted.toDate().getMonth()+1;
        const day =  currentApp.submitted.toDate().getDate();
        const year = currentApp.submitted.toDate().getFullYear();
        return month + "/" + day + "/" + year;
    }

    // fires the updateGrant action and saga
    const updateApp = useCallback(
        (app) => dispatch(grantsActions.updateGrant(app)), [dispatch]
    );

    // fires the sendEmail action and saga
    const sendApplicantEmail = useCallback(
        (currentApp, emailTextArray) => dispatch(grantsActions.sendGrantEmailStart(currentApp, emailTextArray)), [dispatch]
    );

    // closes the email preview box
    const cancelEmailPreview = () => {
        setShowPreview(null);
    };

    // creates the draftjs editor when preview is clicked
    const createEditor = (emailBody) => {
        const blocksFromHTML = convertFromHTML(ReactDomServer.renderToString(emailBody));
        const initialContent = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        setEditorState(EditorState.createWithContent(initialContent));
        setShowPreview(true);
    };

    // shows/hides the delete application button
    const showAdvancedOptions = () => {
        setShowAdvanced(!showAdvanced);
    }

    // keeps track of the status the admin selects
    const handleSelectChange = (value) => {
        if(value === "pending") {
            cancelEmailPreview();
        }

        setCurrentApplicationStatus(value);
    }

    // resets the email text to the default
    const resetDefaultEmail = () => {
        const emailBody = buildEmailPreview();
        createEditor(emailBody);
    }

    const buildEmailPreview = () => {
        if(currentApplicationStatus === "approved") {
            applicantEmailPreview = (
                <>
                    <p>Dear {currentApp.name},</p>
                    <p>The 2021 Mid-Rivers Communications Educational Technology Grant Program review process has been completed.  Your application was one of {props.totalGrants} received, requesting a total of ${props.totalGrantsAmount}. A total of $75,000 was available to award from the Mid-Rivers Fund for Education this year.</p>
                    <p>Mid-Rivers is pleased to announce an award to {currentApp.organizationName} in the amount of ${props.currentGrant.amountAwarded}! </p>
                    <p>We are pleased to be able to offer these 2021 Educational Technology Grants and we are proud of the innovative solutions that were represented in the 2021 grant applications.</p>
                    <p>Please click the link below to sign and accept your Grant offer.</p>
                    <p>{"{WOOFOO-LINK: https://midrivers.wufoo.com/forms/richtbf0fhsdun/}"}    {"{LINK-TEXT: Application Acceptance Form}"}</p>
                    <p>{"<br>"}Sincerely,{"<br>"}Erin Lutts{"<br>"}Chief Communications Officer{"<br>"}erin.lutts@midrivers.coop</p>
                </>
            );
        } else if(currentApplicationStatus === "denied") {
            applicantEmailPreview = (
                <>
                    <p>Dear {currentApp.name},</p>
                    <p>The 2021 Mid-Rivers Communications Educational Technology Grant Program review process has been completed.  Your application was one of {props.totalGrants} received, requesting a total of ${props.totalGrantsAmount}.  A total of $75,000 was available to award from the Mid-Rivers Fund for Education this year.</p>
                    <p>Unfortunately, due to the high demand for grant funds, we were not able to fund your project this year.  We hope to be able to offer grant funds again in 2023.  We also accept applications for eligible sponsorship opportunities on an on-going basis at www.midrivers.com/sponsorships.</p>
                    <p>We thank you again for taking the time to apply and wish you the best in your educational pursuits.</p>
                    <p>{"<br>"}Sincerely,{"<br>"}Erin Lutts{"<br>"}Chief Communications Officer{"<br>"}erin.lutts@midrivers.coop</p>
                </>
            );
        }

        return applicantEmailPreview;
    }

    // Preview the email being sent
    const previewEmail = () => {
        if (editorState) {
            setShowPreview(true);
        } else {
            const emailBody = buildEmailPreview();
            createEditor(emailBody);
        }

    };

    const emailApplicant = (currentApp) => {
        const contentState = editorState.getCurrentContent();
        const blocksArray = contentState.getBlocksAsArray();
        let emailTextArray = [];

        setEmailSending(true);

        for(let idx in blocksArray) {
            let contentBlock = blocksArray[idx];
            emailTextArray.push(contentBlock.getText());
        }

        emailTextArray.forEach((line, idx) => {
            if(line.indexOf("{WOOFOO-LINK:") !== -1) {
                const woofooArray = line.split("}");
                const woofooLink = woofooArray[0].trim().substring(1).split("WOOFOO-LINK:").filter(function(el) { return el; });
                const woofooText = woofooArray[1].trim().substring(1).split("LINK-TEXT:").filter(function(el) { return el; });
                emailTextArray[idx] = `<a href="${woofooLink[0].trim()}">${woofooText[0].trim()}</a>`;
            }
        })

        sendApplicantEmail(currentApp, emailTextArray);
    };

    // calls the popup to confirm deletion of the app
    const showDeleteConfirmation = () => {
        setShowDeleteModal(true);
    }

    // closes the delete confirm popup without deleting the app
    const hideDeleteConfirmation = () => {
        setShowDeleteModal(false);
    }

    // triggers when admin saves changes on the application
    const submitApplication = (formValues) => {
        const approvalTime = formValues.statusSelect !== "pending" ? firebase.firestore.Timestamp.fromDate(new Date()) : "";

        setCurrentApp({
            ...currentApp,
            amountAwarded: formValues.amountApproved > 0 ? formValues.amountApproved : "",
            decisionDate: approvalTime,
            grantsStatus: formValues.statusSelect,
            notes: formValues.notes,
        })

        updateApp({
            ...currentApp,
            toUpdate: {
                amountAwarded: formValues.amountApproved > 0 ? formValues.amountApproved : "",
                decisionDate: approvalTime,
                grantsStatus: formValues.statusSelect,
                notes: formValues.notes,
            }
        })
    }

    // draftjs handler for setting key handlers
    const handleKeyCommand = useCallback((command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }

        return "not-handled"
    });

    return (
        <LayoutWrapper>
            <PageHeader>
                <IntlMessages id="sidebar.grants" />
            </PageHeader>
            {showPreview &&
            <Row gutter={[16, 16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 24}}>
                    <Box style={{padding: 20, height: 'auto'}} className={"email-preview"}>
                        <ApplicationSection>
                            {props.emailError &&
                            <Alert
                                className={props.emailError ? "email-alert php-error show" : "email-alert php-error"}
                                message="Error"
                                description="There was an error sending the applicant email."
                                type="error"
                                showIcon
                            />
                            }
                            {props.fbError &&
                            <Alert
                                className={props.fbError ? "email-alert fb-error show" : "email-alert fb-error"}
                                message="Error"
                                description="There was an error updating the applicant data in firebase."
                                type="error"
                                showIcon
                            />
                            }
                            {props.emailSent &&
                            <Alert
                                className={"email-alert email-sent show"}
                                message="Success"
                                description="The email has been sent to the applicant"
                                type="success"
                                showIcon
                            />
                            }
                            <div className={"editor-wrapper"}>
                                <div className="editor-buttons">
                                    <div className="buttons instructions">
                                        {!props.emailSent
                                            ?
                                            <p>You can edit the text below. Click 'Send Email' to send the applicant
                                                their approval/denial email.</p>
                                            :
                                            <p>The applicant has already been emailed. You can edit the text below
                                                and/or resend the email or cancel.</p>
                                        }
                                    </div>
                                </div>
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                    handleKeyCommand={handleKeyCommand}
                                    spellCheck={true}
                                    ref={editor}
                                    readOnly={props.emailSent === true}
                                />
                            </div>
                            <div className="editor-controls">
                                <Row gutter={[0, 0]}>
                                    <Col xs={{span: 24}}>
                                        <div className="send-email-button-wrapper">
                                            <Button className={"btn cancel-email-btn"}
                                                    type="third" size={"large"}
                                                    onClick={(e) => {
                                                        resetDefaultEmail()
                                                    }}
                                            >Reset to default</Button>

                                            <div className="right">
                                                <Space>
                                                    <Button className={"btn cancel-email-btn"}
                                                            type="secondary" size={"large"}
                                                            onClick={(e) => {
                                                                cancelEmailPreview()
                                                            }}
                                                    >Cancel</Button>

                                                    <Button className={"btn send-email-to-email-applicant"}
                                                            loading={props.emailLoading}
                                                            type="primary" size={"large"}
                                                            disabled={currentApp.grantsStatus === 'Pending'}
                                                            onClick={(e) => {
                                                                emailApplicant(currentApp)
                                                            }}
                                                    >{!props.emailSent ? "Send Email" : "Resend Email"}</Button>
                                                </Space>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        </ApplicationSection>
                    </Box>
                </Col>
            </Row>
            }
            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Organization Information</Title>
                            <Card size="small"  style={{ width: 600 }}>
                                <div className={"orgCard"}>
                                    <h5>Organization Name:</h5>
                                    <p>{currentApp.organizationName}</p>
                                </div>
                                <div className={"orgCard"}>
                                    <h5>Address:</h5>
                                    <p>{currentApp.organizationAddress}</p>
                                    {currentApp.organizationDDressLineTwo !== null && <p>{currentApp.organizationDDressLineTwo}</p>}
                                    <p>{currentApp.city}, {currentApp.state} {currentApp.zipcode}</p>
                                </div>
                                <div className="orgCard">
                                    <h5>Contact:</h5>
                                    <p>Name: {currentApp.name}</p>
                                    <p>Phone: {currentApp.phone}</p>
                                    <p>Email: {currentApp.email}</p>
                                </div>

                                <div className={"orgCard"}>
                                    <h5>Request:</h5>
                                    <p>Amount Requested: {formatAmountRequested(currentApp.amountRequested)}</p>
                                </div>
                            </Card>
                        </ApplicationSection>
                        <ApplicationSection>
                            <div className="playerWrapper">
                                <Title level={3} className={"application-section-title"}>Video</Title>
                                <ReactPlayer
                                    width="100%"
                                    url={currentApp.videoLink}/>
                                <p className={"videoUrl"}>Video URL: <a href={currentApp.videoLink} target="_blank">{currentApp.videoLink}</a></p>
                            </div>
                        </ApplicationSection>
                    </Box>
                </Col>

                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Admin Tools</Title>
                            <section className={"admin-section"}>
                                <p className={'status'}>Current Status: <span>{currentApp.grantsStatus}</span></p>
                                <p className={'date'}>Submitted on: <span>{getFormattedSubmittedDate()}</span></p>
                                {currentApp.grantsStatus !== 'pending'}
                                <p className={'notification-status'}>The applicant has {!props.currentGrant.notificationEmailed && "not "}been notified.</p>
                            </section>

                            <section className={"admin-section"}>
                                <Form name="admin-form" layout="vertical" size={"default"}  onFinish={(values) => {submitApplication(values)}}
                                      initialValues={{
                                          amountApproved: currentApp.amountAwarded !== 0 ? currentApp.amountAwarded : "",
                                          statusSelect: currentApp.grantsStatus,
                                          notes: currentApp.notes
                                      }}
                                >

                                    <Form.Item
                                        name="notes"
                                        label={<h3 className="group-title">Application Notes</h3>}>
                                        <Input.TextArea
                                            name="notes"
                                            label={"Application Notes"}
                                            rows={5}
                                            disabled={currentApp.notificationEmailed}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="amountApproved"
                                        label="Amount Approved">
                                        <Input
                                            className="amountApproved"
                                            name="amountApproved"
                                            disabled={props.currentGrant.notificationEmailed}
                                            placeholder="0.00" value={currentApp.AmountAwarded}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="statusSelect"
                                        label={<h3 className="group-title">Set Application Status</h3>}>
                                        <Select
                                            onChange={handleSelectChange}
                                            placeholder={"Status"}
                                            name="statusSelect"
                                            disabled={props.currentGrant.notificationEmailed}
                                        >
                                            <Option value="pending">Pending</Option>
                                            <Option value="approved">Approved</Option>
                                            <Option value="denied">Denied</Option>
                                        </Select>
                                    </Form.Item>

                                    <Row className={"btn-row"}>
                                        <Col span={12}>
                                            <Button htmlType="submit"
                                                    className={"btn submit"} loading={props.saveLoading}
                                                    type="primary" size={"large"}
                                                    disabled={currentApp.notificationEmailed}>Save</Button>
                                        </Col>

                                        <Col span={12}>
                                            {!props.currentGrant.notificationEmailed &&
                                            <Button className={"btn preview-email-applicant"}
                                                    type="default" size={"large"}
                                                    disabled={props.currentGrant.grantsStatus === 'pending'}
                                                    onClick={(e) => {previewEmail()}}
                                            >Preview Email</Button>
                                            }
                                        </Col>

                                        {props.currentGrant.notificationEmailed && <Col span={24}><p className={"applicantNotified"}>This applicant has been notified and the application cannot be changed.</p></Col>}
                                    </Row>

                                    {/*<Divider />*/}

                                    {/*<Row>*/}
                                    {/*    <Col span={24}>*/}
                                    {/*        <Checkbox className="show-advanced-chkbox" onChange={showAdvancedOptions}>Show Advanced Options</Checkbox>*/}
                                    {/*    </Col>*/}
                                    {/*    {showAdvanced &&*/}
                                    {/*    <Col span={24}>*/}
                                    {/*        <Button className={"delete-record-btn"}*/}
                                    {/*                type="delete"*/}
                                    {/*                size={"large"}*/}
                                    {/*                disabled={currentApp.notificationEmailed}*/}
                                    {/*                onClick={showDeleteConfirmation}*/}
                                    {/*        >Delete Application</Button>*/}
                                    {/*    </Col>*/}
                                    {/*    }*/}
                                    {/*</Row>*/}
                                </Form>
                            </section>
                        </ApplicationSection>
                    </Box>
                </Col>
            </Row>
        </LayoutWrapper>
    )
}