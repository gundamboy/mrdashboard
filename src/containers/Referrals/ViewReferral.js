import React, {useState, useCallback, useRef} from 'react';
import ReactDomServer from 'react-dom/server';
import { useDispatch } from 'react-redux';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import referralActions from "../../redux/referrals/actions";
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import PageHeader from "@iso/components/utility/pageHeader";
import {EditorWrapper, ReferralSection, StatusHeader} from "./Referrals.styles";
import {formattedDate} from "../../helpers/shared";
import {Alert, Button, Col, Form, Row, Select, Space, Typography, Input, Table} from "antd";
import {EditorControls} from "../Scholarships/Scholarships.styles";

export default function (props) {
    const dispatch = useDispatch();
    const editor = useRef(null);
    const [editorState, setEditorState] = useState(null);
    const [currentApp, setCurrentApp] = useState(props.currentReferral);
    const [showPreview, setShowPreview] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(props.currentReferral.referralStatus);
    let applicantEmailPreview = null;
    const accountNumber = props.currentReferral.accountNumber;
    const personYouAreReferring = props.currentReferral.personYouAreReferring;
    const refereeEmail = props.currentReferral.refereeEmail;
    const referrerEmail = props.currentReferral.referrerEmail;
    const referrerName = props.currentReferral.referrerName;
    const submitted = props.currentReferral.submitted;
    const applicantNotified = props.currentReferral.notificationEmailed;
    const { Title } = Typography;
    const { TextArea } = Input;

    // hide the email box if sending the email succeeded
    if(props.currentReferral.notificationEmailed) {
        if(emailSending === true) {
            setShowPreview(false);
            setEmailSending(false);
        }
    }

    const onFormsFinish = () => {}

    const updateNotes = useCallback(
        (id, notes) => dispatch(referralActions.updateReferralNotes(id, notes.target.value)),
        [dispatch]
    );

    const updateApprovalStatus = useCallback(
        (id, status) => dispatch(referralActions.updateReferralStart(id, status)),
        [dispatch]
    );

    const sendReferralEmail = useCallback(
        (referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray,
         userId, status) => dispatch(referralActions.sendReferralEmailStart(referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray, userId, status)),
        [dispatch]
    );

    const onApprovalStatusChange = (status) => {
        setCurrentApplicationStatus(status);
        updateApprovalStatus(props.userId, status);

        if(showPreview) {
            cancelEmailPreview();
            setEditorState(null);
        }
    }

    // default email text for the editor
    const referralEmailText = () => {
        if(currentApplicationStatus === "approved") {
            return (
                <>
                    <p>Congratulations! You have been approved to receive a Referral Credit from Mid-Rivers Communications. A credit will appear on your next Mid-Rivers Statement.  If you would like to keep earning referral credits, please refer your friends to Mid-Rivers Internet.</p>
                </>
            )
        } else {
            // denied
            return (
                <>
                    <p>Thank you for joining Mid-Rivers Communications’ referral program. Unfortunately, your referral did not meet the necessary qualifications  to receive a credit. If you would like to refer additional people for a chance to earn referral credits, please go to https://www.midrivers.com/internet/</p>
                </>
            )
        }
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

    // Preview the email being sent
    const previewEmail = (e) => {
        e.preventDefault();
        if (editorState) {
            setShowPreview(true);
        } else {
            // get email text/body and set it in createEditor
            showEmailText();
        }
    };

    // resets the email text to the default
    const showEmailText = () => {
        const emailBody = referralEmailText();
        createEditor(emailBody);
    };

    // closes the email preview box
    const cancelEmailPreview = () => {
        setShowPreview(null);
    };

    // resets the email text to the default
    const resetDefaultEmail = () => {
        showEmailText();
    }

    // gets the editor contents and triggers the sendApplication function
    const emailApplicant = () => {
        const contentState = editorState.getCurrentContent();
        const blocksArray = contentState.getBlocksAsArray();
        let emailTextArray = [];

        setEmailSending(true);

        for(let idx in blocksArray) {
            let contentBlock = blocksArray[idx];
            emailTextArray.push(contentBlock.getText());
        }

        sendReferralEmail(referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray, props.userId, currentApplicationStatus)
    };

    const columns = [
        {
            title: "Referrer Information",
            dataIndex: "referrer",
            key: "referrer",
            render: text => <div>{text}</div>
        },
        {
            title: "Referee Information",
            dataIndex: "referee",
            key: "referee",
            render: text => <div>{text}</div>
        },
    ];

    const tableData = [
        {
            key: "1",
            referrer: <>
                <p><span className="subtitle">Submission Date</span>: {submitted}</p>
                <p><span className="subtitle">Referrer Name</span>: {referrerName}</p>
                <p><span className="subtitle">Referrer Email</span>: {referrerEmail}</p>
                <p><span className="subtitle">Referrer Mid-Rivers Account</span>: {accountNumber}</p>
            </>,
            referee: <>
                <p><span className="subtitle">Referee Name</span>: {personYouAreReferring}</p>
                <p><span className="subtitle">Referee Email</span>: {refereeEmail}</p>
            </>
        }
    ];

    return (
        <LayoutWrapper>
            <StatusHeader>
                <PageHeader>Referral Application</PageHeader>
                <h1 className="current-status">Current Status: <span className={`status ${currentApplicationStatus}`}>{currentApplicationStatus}</span></h1>
            </StatusHeader>

            {showPreview  &&
            <Row gutter={[16, 16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 24}}>
                    <div className={"editor-wrapper"}>
                        <Box style={{padding: 20, height: 'auto'}}>
                            <ReferralSection>
                                <Title level={3} className={"application-section-title"}>Email Preview</Title>
                            </ReferralSection>

                            {(props.referralEmailError && !props.referralsFirebaseEmailError) &&
                            <Alert
                                className={props.referralEmailError ? "email-alert php-error show" : "email-alert php-error"}
                                message="Error"
                                description="There was an error sending the applicant email."
                                type="error"
                                showIcon
                            />
                            }

                            {props.referralsFirebaseEmailError &&
                            <Alert
                                className={props.referralsFirebaseEmailError ? "email-alert fb-error show" : "email-alert fb-error"}
                                message="Error"
                                description="There was an error updating the applicant data in firebase."
                                type="error"
                                showIcon
                            />
                            }

                            <EditorWrapper>
                                <ReferralSection>
                                    <div className="editor-buttons">
                                        <div className="buttons instructions">
                                            {!props.emailSent
                                                ?
                                                <p>You can edit the text below. Click 'Send Email' to send the applicant their approval/denial email.</p>
                                                :
                                                <p>The applicant has already been emailed. You can edit the text below and/or
                                                    resend the email or cancel.</p>
                                            }
                                        </div>
                                    </div>
                                </ReferralSection>
                                <ReferralSection>
                                    <Editor
                                        editorState={editorState}
                                        onChange={setEditorState}
                                        handleKeyCommand={handleKeyCommand}
                                        spellCheck={true}
                                        ref={editor}
                                    />
                                </ReferralSection>
                            </EditorWrapper>

                            <ReferralSection>
                                <EditorControls>
                                    <div className="send-email-button-wrapper">
                                        <Button className={"btn cancel-email-btn"}
                                                type="third" size={"large"}
                                                onClick={(e) => {
                                                    showEmailText()
                                                }}
                                                disabled={emailSending}
                                        >Reset to default</Button>

                                        <div className="right">
                                            <Space>
                                                <Button className={"btn cancel-email-btn"}
                                                        type="secondary" size={"large"}
                                                        onClick={(e) => {
                                                            cancelEmailPreview()
                                                        }}
                                                        disabled={props.sendingEmail}
                                                >Cancel</Button>

                                                <Button className={"btn send-email-to-email-applicant"}
                                                        loading={props.sendingEmail}
                                                        type="primary" size={"large"}
                                                        disabled={currentApplicationStatus === 'pending'}
                                                        onClick={(e) => {
                                                            emailApplicant()
                                                        }}
                                                >{!props.emailSent ? "Send Email" : "Resend Email"}</Button>
                                            </Space>
                                        </div>
                                    </div>
                                </EditorControls>
                            </ReferralSection>
                        </Box>
                    </div>
                </Col>
            </Row>
            }


            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 14}} lg={{span: 14}}>
                    <ReferralSection>
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            pagination={{hideOnSinglePage: true}}
                        />
                    </ReferralSection>
                </Col>

                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 10}} lg={{span: 10}}>
                    <Box className={"admin-box"} style={{ padding: 20, height: 'auto' }}>
                        <ReferralSection>
                            <Title level={3} className={"application-section-title"}>Admin</Title>
                        </ReferralSection>

                        <ReferralSection className={"admin-section"}>
                            <Title level={4} className={"admin-section-title"}>Email Options:</Title>
                            {!applicantNotified ?
                                <>
                                    <p className={"applicantNotified"}>This applicant has not been notified.</p>
                                    <p className={currentApplicationStatus === 'pending' ? "" : "hide"}>Emails cannot be sent with a status of Pending.</p>
                                    <div className="preview-email-button-wrapper">
                                        <Button className={"btn preview-email-applicant"}
                                                type="default" size={"large"}
                                                disabled={currentApplicationStatus === 'pending'}
                                                onClick={previewEmail}
                                        >Preview Email</Button>
                                    </div>
                                </>
                                :
                                <p className={"applicantNotified"}>This applicant has been notified and the application cannot be changed.</p>
                            }
                        </ReferralSection>

                        <ReferralSection className={"admin-section"}>
                            <Title level={4} className={"admin-section-title"}>Notes:</Title>
                            <Form layout="vertical" name="notes-form" onFinish={onFormsFinish}>
                                <Form.Item label="">
                                    <TextArea rows={4}
                                              onKeyUp={(e) => {updateNotes(props.userId, e)}}
                                              defaultValue={props.currentReferral.notes ? props.currentReferral.notes : ""}
                                    />
                                </Form.Item>
                            </Form>
                        </ReferralSection>

                        <ReferralSection className={"admin-section"}>
                            <Title level={4} className={"admin-section-title"}>Approvals</Title>
                            <Form layout="vertical" name="approvals-form" onFinish={onFormsFinish}>
                                <Form.Item label="Approval Status">
                                    <Select disabled={applicantNotified} className="approval-select" key={"approval"} defaultValue={currentApplicationStatus}
                                            onChange={(v) => onApprovalStatusChange(v)}>
                                        <Select.Option value={"approved"}>Approved</Select.Option>
                                        <Select.Option value={"denied"}>Denied</Select.Option>
                                        <Select.Option value={"pending"}>Pending</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </ReferralSection>
                    </Box>
                </Col>
            </Row>

        </LayoutWrapper>
    )
}