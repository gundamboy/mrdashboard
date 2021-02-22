import React, {useState, useCallback, useRef} from 'react';
import {Redirect} from "react-router";
import ReactDomServer from 'react-dom/server';
import { useDispatch } from 'react-redux';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import {sponsorshipSingleViewColumns, filesSingleViewColumns} from "../Tables/AntTables/configs";
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import {Alert, Row, Col, Button, Form, Select, Input, Space, Typography, Divider, Checkbox, Modal} from 'antd';
import {MinusCircleOutlined, PlusOutlined, UnderlineOutlined} from '@ant-design/icons';
import {ApplicationSection} from "./Sponsorships.styles";
import sponsorshipActions from "../../redux/sponsorships/actions";
import sponsorshipsReducer from "../../redux/sponsorships/reducer";
import * as firebase from "firebase";
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";


export default function (props) {
    const editor = useRef(null);
    const [currentApp, setCurrentApp] = useState(props.currentSponsorship);
    const [editorState, setEditorState] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(props.currentSponsorship.admin.approvalStatus)
    let applicantEmailPreview = null;
    const submissionInfo = currentApp.submission;
    const appMeta = currentApp.meta;
    const appType = submissionInfo.sponsorshipSelect;
    const appStatus = currentApp.admin.approvalStatus;
    const dispatch = useDispatch();
    const { Option } = Select;
    const { Title } = Typography;
    let appTypeFieldsToShow = "";
    let approvalDate = "";
    let existingItems = null;

    const orgAddress = (
        <>
            <span className="address">{submissionInfo.orgAddress}</span>
            <span className="address">{submissionInfo.orgCity + ", " + submissionInfo.orgZip}</span>
        </>
    );

    const primaryAddress = (
        <>
            <span className="address">{submissionInfo.primaryAddress}</span>
            <span className="address">{submissionInfo.primaryCity + ", " + submissionInfo.primaryZip}</span>
        </>
    )

    const getAppFiles = () => {
        if (appMeta.hasFiles) {
            const theFile = currentApp.fileInfo;
            return (<a href={theFile.url} target="_blank">{theFile.name}</a> );
        } else {
            return "No files were provided";
        }
    };

    const orgInfo = [
        {
            key: "organization",
            question: "Are You requesting as an Organization or Individual?",
            answer: "Organization",
            dataIndex: "organization"
        },
        {
            key: 'orgName',
            question: "Organization Name",
            answer: submissionInfo.orgName,
            dataIndex: 'questions'
        },
        {
            key: 'orgAddress',
            question: "Organization's Physical Address",
            answer: orgAddress,
            dataIndex: 'questions'
        },
        {
            key: "orgEstablished",
            question: 'Year Established',
            answer: submissionInfo.orgEstablished,
            dataIndex: "orgEstablished"
        },
        {
            key: "orgWebsite",
            question: "Organization's Website URL",
            answer: <a href={formatWebsite(submissionInfo.orgWebsite)} target="_blank">{submissionInfo.orgWebsite}</a>,
            dataIndex: "orgWebsite"
        },
        {
            key: "orgFacebook",
            question: "Organization's Facebook Page",
            answer: <a href={formatWebsite(submissionInfo.orgFacebook)} target="_blank">{submissionInfo.orgFacebook}</a>,
            dataIndex: "orgFacebook"
        },
        {
            key: "orgInstagram",
            question: "Organization's Instagram Username",
            answer: socialLink("instagram", submissionInfo.orgInstagram),
            dataIndex: "orgInstagram"
        },
        {
            key: "orgTwitter",
            question: "Organization's Twitter Handle",
            answer: submissionInfo.orgTwitter.length ? socialLink("twitter", submissionInfo.orgTwitter) : "",
            dataIndex: "orgTwitter"
        }
    ];
    const primaryInfo = [
        {
            key: "primaryName",
            question: "Primary Contact Name",
            answer: submissionInfo.primaryName,
            dataIndex: "primaryName"
        },
        {
            key: "primaryEmail",
            question: "Primary Contact Email",
            answer: submissionInfo.primaryEmail,
            dataIndex: "primaryEmail"
        },
        {
            key: "primaryPhone",
            question: "Primary Contact Phone",
            answer: submissionInfo.primaryPhone,
            dataIndex: "primaryPhone"
        },
        {
            key: "primaryAddress",
            question: "Primary Contact Address",
            answer: primaryAddress,
            dataIndex: "primaryAddress"
        },
        {
            key: "relationship",
            question: "Title/Relationship to Organization/Individual",
            answer: submissionInfo.relationship,
            dataIndex: "relationship"
        },
    ];
    let fileInfo = [
        {
            key: 'files',
            files: getAppFiles(),
            dataIndex: 'files'
        }];
    let eventInfo = [
        {
            key: 'sponsorshipSelect',
            question: 'What type of request are you making?',
            answer: submissionInfo.sponsorshipSelect,
            dataIndex: 'sponsorshipSelect'
        },
        {
            key: 'eventName',
            question: 'Event/Project Name',
            answer: submissionInfo.eventName,
            dataIndex: 'eventName'
        },
        {
            key: 'eventDescription',
            question: 'Event/Project Description',
            answer: submissionInfo.eventDescription,
            dataIndex: 'eventDescription'
        },
        {
            key: submissionInfo.sponsorshipSelect === "Monetary" ? 'eventMoney' : "eventItems",
            question: submissionInfo.sponsorshipSelect === "Monetary" ? 'Amount Requested' : "Items Requested",
            answer: submissionInfo.sponsorshipSelect === "Monetary" ? submissionInfo.eventMoney : submissionInfo.eventItems,
            dataIndex: submissionInfo.sponsorshipSelect === "Monetary" ? 'eventMoney' : "eventItems"
        },

        {
            key: submissionInfo.sponsorshipSelect === "Monetary" ? 'eventMoneyDate' : "eventItemsDate",
            question: submissionInfo.sponsorshipSelect === "Monetary" ? 'Amount Requested' : "Items Requested",
            answer: submissionInfo.sponsorshipSelect === "Monetary" ? submissionInfo.eventMoneyDate : submissionInfo.eventItemsDate,
            dataIndex: submissionInfo.sponsorshipSelect === "Monetary" ? 'eventMoneyDate' : "eventItemsDate"
        },
        {
            key: 'eventPurpose',
            question: 'Purpose of Sponsorship',
            answer: submissionInfo.eventPurpose,
            dataIndex: 'eventPurpose'
        },
        {
            key: 'eventBenefits',
            question: 'Benefits available with sponsorship',
            answer: submissionInfo.eventBenefits,
            dataIndex: 'eventBenefits'
        },
        {
            key: 'advertisingEnd',
            question: 'Advertising Dates',
            answer: submissionInfo.advertisingStart + " - " + submissionInfo.advertisingEnd,
            dataIndex: 'advertisingEnd'
        },
        {
            key: 'advertisingAudience',
            question: 'Audience Reached with Sponsorship',
            answer: submissionInfo.advertisingAudience,
            dataIndex: 'advertisingAudience'
        },
        {
            key: 'reference',
            question: 'Referred By',
            answer: submissionInfo.reference,
            dataIndex: 'reference'
        },
        {
            key: 'additionalInformation',
            question: 'Any additional information or notes you would like add?',
            answer: submissionInfo.additionalInformation,
            dataIndex: 'additionalInformation'
        }
    ];

    // fires the updateApplication action and saga
    const updateApp = useCallback(
        (app) => dispatch(sponsorshipActions.updateApplication(app)), [dispatch]
    );

    // fires the sendEmail action and saga
    const sendApplicantEmail = useCallback(
        (currentApp, emailArray) => dispatch(sponsorshipActions.sendEmail(currentApp, emailArray, appType)), [dispatch]
    );

    // fires the deleteSponsorship action and saga
    const deleteApplication = useCallback(
        () => dispatch(sponsorshipActions.deleteSponsorship(currentApp.id)), [dispatch]
    )

    // gets the editor contents and triggers the sendApplication function
    const emailApplicant = (currentApp) => {
        const contentState = editorState.getCurrentContent();
        const blocksArray = contentState.getBlocksAsArray();

        let emailArray = [];

        for(let idx in blocksArray) {
            let contentBlock = blocksArray[idx];
            emailArray.push(contentBlock.getText());
        }

        sendApplicantEmail(currentApp, emailArray);
    }

    // sets the items array into the items fields if they already exist
    if(currentApp.admin.itemsApproved.length) {
        let itemsArray = [];

        for (let idx in currentApp.admin.itemsApproved) {
            const item = {
                itemQty: currentApp.admin.itemsApproved[idx].itemQty,
                itemName: currentApp.admin.itemsApproved[idx].itemName,
            }

            itemsArray.push(item);
        }

        existingItems = itemsArray;
    }

    // displays either monetary or material specific fields
    if(appType === "Monetary") {
        appTypeFieldsToShow =  (
            <div className="form-group">
                <h3 className="group-title">Monetary</h3>
                <Form.Item
                    name="amountApproved"
                    label="Amount Approved">
                    <Input
                        className="amountApproved"
                        name="amountApproved"
                        placeholder="0.00" value={currentApp.admin.amountApproved}
                    />
                </Form.Item>
            </div>
        );
    } else {
        appTypeFieldsToShow =  (
            <div className="form-group">
                <h3 className="group-title">Material Items</h3>
                <Form.List name="items">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map(
                                    field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'itemName']}
                                                className={"itemName"}
                                                fieldKey={[field.fieldKey, 'itemName']}
                                                rules={[{ required: true, message: 'Missing Item Name' }]}
                                            >
                                                <Input placeholder="Item Name" disabled={props.currentSponsorship.admin.notificationEmailed}/>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'itemQty']}
                                                className={"itemQty"}
                                                fieldKey={[field.fieldKey, 'itemQty']}
                                                rules={[{ required: true, message: 'Missing Item Quantity' }]}
                                            >
                                                <Input placeholder="Qty" disabled={props.currentSponsorship.admin.notificationEmailed}/>
                                            </Form.Item>

                                            {!props.currentSponsorship.admin.notificationEmailed &&
                                            <MinusCircleOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                            }
                                        </Space>
                                    )
                                )}

                                <Form.Item>
                                    <Button
                                        disabled={props.currentSponsorship.admin.notificationEmailed}
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                        }}
                                        block
                                    >
                                        <PlusOutlined /> Add Item
                                    </Button>
                                </Form.Item>
                            </div>
                        )
                    }}
                </Form.List>
            </div>
        );
    }

    // set approval status and date
    if(appStatus === "approved") {
        approvalDate = (
            <p className={'approvalDate approved'}>Approved on: <span className={'date'}>{
                currentApp.admin.approvalDate.toDate().getMonth()+1 + "/" +
                currentApp.admin.approvalDate.toDate().getDate() + "/" +
                currentApp.admin.approvalDate.toDate().getFullYear()}</span></p>
        )
    } else if(appStatus === 'denied') {
        approvalDate = (
            <p className={'approvalDate denied'}>Denied on: <span className={'date'}>{
                currentApp.admin.approvalDate.toDate().getMonth()+1 + "/" +
                currentApp.admin.approvalDate.toDate().getDate() + "/" +
                currentApp.admin.approvalDate.toDate().getFullYear()}</span></p>
        )
    }

    // triggers when admin saves changes on the application
    const submitApplication = (formValues, appType) => {
        const approvalTime = formValues.statusSelect !== "pending" ? firebase.firestore.Timestamp.fromDate(new Date()) : "";
        let updatedApp = {};

        if(appType === "Material") {
            setCurrentApp({
                ...currentApp,
                admin: {
                    ...currentApp.admin,
                    approvalDate: approvalTime,
                    approvalStatus: formValues.statusSelect,
                    notes: formValues.notes,
                    itemsApproved: formValues.items,
                }
            })

            updatedApp = {
                ...currentApp,
                admin: {
                    ...currentApp.admin,
                    approvalDate: approvalTime,
                    approvalStatus: formValues.statusSelect,
                    notes: formValues.notes,
                    itemsApproved: formValues.items,
                }
            }

        } else {
            setCurrentApp({
                ...currentApp,
                admin: {
                    ...currentApp.admin,
                    approvalDate: approvalTime,
                    approvalStatus: formValues.statusSelect,
                    notes: formValues.notes,
                    amountApproved: formValues.amountApproved,
                }
            })

            updatedApp = {
                ...currentApp,
                admin: {
                    ...currentApp.admin,
                    approvalDate: approvalTime,
                    approvalStatus: formValues.statusSelect,
                    notes: formValues.notes,
                    amountApproved: formValues.amountApproved,
                }
            }
        }

        updateApp(updatedApp);
    };

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

    // closes the email preview box
    const cancelEmailPreview = () => {
        setShowPreview(null);
    };

    // resets the email text to the default
    const resetDefaultEmail = () => {
        const emailBody = buildEmailPreview();
        createEditor(emailBody);
    }

    // generates the default email text
    const buildEmailPreview = () => {
        if(appType === "Monetary") {
            if(currentApp.admin.approvalStatus === "approved") {
                applicantEmailPreview = (
                    <>
                        <p>Dear {submissionInfo.primaryName},</p>
                        <p>Thank you for submitting the Community Sponsorship Request form. We are pleased to inform you that your
                            sponsorship request has been approved for ${currentApp.admin.amountApproved}.</p>
                        <p>The funds will be send to the organization’s address provided in the form. Please allow up to 2 weeks for the check to arrive. If you have any questions or need additional information, please contact Nicole Senner at nicole.senner@midrivers.coop or 406-687-7322.</p>
                    </>
                );
            } else if(currentApp.admin.approvalStatus === "denied") {
                applicantEmailPreview = (
                    <>
                        <p>Dear {submissionInfo.primaryName},</p>
                        <p>Thank you for submitting the Community Sponsorship Request form. We regret to inform you that we are unable to fulfill your request at this time.</p>
                        <p>If you have any questions, please contact Nicole Senner at nicole.senner@midrivers.coop or 406-687-7322.</p>
                    </>
                );
            }
        } else {
            if(currentApp.admin.approvalStatus === "approved") {
                // create the items string for the editor preview
                let itemsTextArray = [];

                if(existingItems.length) {
                    for (let idx in existingItems) {
                        if(parseInt(idx) === existingItems.length - 1) {
                            itemsTextArray.push("and " + existingItems[idx].itemQty + " " + existingItems[idx].itemName);
                        } else {
                            itemsTextArray.push(existingItems[idx].itemQty + " " + existingItems[idx].itemName);
                        }
                    }
                }

                // set the default email to show in the editor
                applicantEmailPreview = (
                    <>
                        <p>Dear {submissionInfo.primaryName},</p>
                        <p>Thank you for submitting the Community Sponsorship Request form. We are pleased to inform you that your sponsorship request has been approved for the following items:</p>
                        <p>{itemsTextArray.join(', ')}.</p>
                        <p>Please contact Nicole Senner at nicole.senner@midrivers.coop or 406-687-7387 to coordinate the delivery of the items or if you have any questions.</p>
                    </>
                );
            } else if(currentApp.admin.approvalStatus === "denied") {
                applicantEmailPreview = (
                    <>
                        <p>Dear {submissionInfo.primaryName},</p>
                        <p>Thank you for submitting the Community Sponsorship Request form. We regret to inform you that we are unable to fulfill your request at this time.</p>
                        <p>If you have any questions, please contact Nicole Senner at nicole.senner@midrivers.coop or 406-687-7322.</p>
                    </>
                );
            }
        }

        return applicantEmailPreview;
    };

    // Preview the email being sent
    const previewEmail = () => {
        if (editorState) {
            setShowPreview(true);
        } else {
            const emailBody = buildEmailPreview();
            createEditor(emailBody);
        }

    };

    // shows/hides the delete application button
    const showAdvancedOptions = () => {
        setShowAdvanced(!showAdvanced);
    }

    // calls the popup to confirm deletion of the app
    const showDeleteConfirmation = () => {
        setShowDeleteModal(true);
    }

    // closes the delete confirm popup without deleting the app
    const hideDeleteConfirmation = () => {
        setShowDeleteModal(false);
    }

    // keeps track of the status the admin selects
    const handleSelectChange = (value) => {
        setCurrentApplicationStatus(value);
    }

    return (
        <LayoutWrapper>
            <PageHeader>
                <IntlMessages id="sidebar.sponsorships" />
            </PageHeader>
            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
                    {showPreview &&
                    <Box style={{padding: 20, height: 'auto'}} className={"email-preview"} >
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
                                className={"email-alert email-sent show" }
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
                                            <p>You can edit the text below. Click 'Send Email' to send the applicant their approval/denial email.</p>
                                            :
                                            <p>The applicant has already been emailed. You can edit the text below and/or resend the email or cancel.</p>
                                        }
                                    </div>
                                </div>
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                    handleKeyCommand={handleKeyCommand}
                                    spellCheck={true}
                                    ref={editor}
                                    readOnly={!props.emailSent}
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
                                                        disabled={currentApp.admin.approvalStatus === 'pending'}
                                                        onClick={(e) => {
                                                            emailApplicant(currentApp)
                                                        }}
                                                >{!props.emailSent ? "Send Email" : "Resend Email" }</Button>
                                            </Space>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            </div>

                        </ApplicationSection>
                    </Box>
                    }
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Organization Information</Title>
                            <TableWrapper
                                pagination={false}
                                columns={sponsorshipSingleViewColumns}
                                dataSource={orgInfo}
                                className="isoSimpleTable"
                                bordered
                            />
                        </ApplicationSection>

                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Primary Information</Title>
                            <TableWrapper
                                pagination={false}
                                columns={sponsorshipSingleViewColumns}
                                dataSource={primaryInfo}
                                className="isoSimpleTable"
                                bordered
                            />
                        </ApplicationSection>

                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Event Information</Title>
                            <TableWrapper
                                pagination={false}
                                columns={sponsorshipSingleViewColumns}
                                dataSource={eventInfo}
                                className="isoSimpleTable"
                                bordered
                            />
                        </ApplicationSection>

                        {currentApp.fileInfo !== null &&
                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>File Information</Title>
                            <TableWrapper
                                pagination={false}
                                columns={filesSingleViewColumns}
                                dataSource={fileInfo}
                                className="isoSimpleTable"
                                bordered
                            />
                        </ApplicationSection>
                        }
                    </Box>
                </Col>

                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ApplicationSection>
                            <Title level={3} className={"application-section-title"}>Admin Tools</Title>
                            <section className={"admin-section"}>
                                <p className={'status'}>Current Status: <span>{currentApp.admin.approvalStatus}</span></p>
                                <p className={'date'}>Submitted on: <span>{currentApp.meta.submissionDate.toDate().getMonth()+1 + "/" + currentApp.meta.submissionDate.toDate().getDate() + "/" + currentApp.meta.submissionDate.toDate().getFullYear()}</span></p>
                                {currentApp.admin.approvalStatus !== 'pending' && approvalDate}
                                <p className={'notification-status'}>The applicant has {!props.currentSponsorship.admin.notificationEmailed && "not "}been notified.</p>
                            </section>
                            <section className={"admin-section"}>
                                <Form name="admin-form" layout="vertical" size={"default"}  onFinish={(values) => {submitApplication(values, appType)}}
                                      initialValues={{
                                          items: existingItems !== null ? existingItems : [],
                                          amountApproved: currentApp.admin.amountApproved !== 0 ? currentApp.admin.amountApproved : "",
                                          statusSelect: currentApp.admin.approvalStatus,
                                          notes: currentApp.admin.notes
                                      }}
                                >

                                    {appTypeFieldsToShow}

                                    <Form.Item
                                        name="notes"
                                        label={<h3 className="group-title">Application Notes</h3>}>
                                        <Input.TextArea
                                            name="notes"
                                            label={"Application Notes"}
                                            rows={5}
                                            disabled={props.currentSponsorship.admin.notificationEmailed}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="statusSelect"
                                        label={<h3 className="group-title">Set Application Status</h3>}>
                                        <Select
                                            onChange={handleSelectChange}
                                            placeholder={"Status"}
                                            name="statusSelect"
                                            disabled={props.currentSponsorship.admin.notificationEmailed}
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
                                                    disabled={props.currentSponsorship.admin.notificationEmailed}>Save</Button>
                                        </Col>

                                        <Col span={12}>
                                            {!props.currentSponsorship.admin.notificationEmailed &&
                                                <Button className={"btn preview-email-applicant"}
                                                        type="default" size={"large"}
                                                        disabled={currentApplicationStatus === 'pending'}
                                                        onClick={(e) => {previewEmail()}}
                                                >Preview Email</Button>
                                            }
                                        </Col>


                                        {props.currentSponsorship.admin.notificationEmailed && <Col span={24}><p className={"applicantNotified"}>This applicant has been notified and the application cannot be changed.</p></Col>}
                                    </Row>

                                    <Divider />

                                    <Row>
                                        <Col span={24}>
                                            <Checkbox className="show-advanced-chkbox" onChange={showAdvancedOptions}>Show Advanced Options</Checkbox>
                                        </Col>
                                        {showAdvanced &&
                                        <Col span={24}>
                                            <Button className={"delete-record-btn"}
                                                    type="delete"
                                                    size={"large"}
                                                    disabled={props.currentSponsorship.admin.notificationEmailed}
                                                    onClick={showDeleteConfirmation}
                                            >Delete Application</Button>
                                        </Col>
                                        }
                                    </Row>
                                </Form>
                            </section>
                        </ApplicationSection>
                    </Box>
                </Col>
            </Row>
            <Modal
                visible={showDeleteModal}
                title="Confirm Delete"
                onOk={deleteApplication}
                centered={true}
                onCancel={hideDeleteConfirmation}
            >
                <p>This action cannot be undone. Do you wish to proceed?</p>
            </Modal>
        </LayoutWrapper>
    )
}

function formatWebsite(site) {
    let address = site;

    if(!address.includes('http://')) {
        address = 'http://' + site;
    }

    return address;
}

function socialLink(service, text) {
    let username = text;

    if (text.includes("@")) {
        username = text.replace("@", "");
    }
    if (service === 'twitter') {
        return <a href={"https://twitter.com/" + username} target="_blank">{text}</a>
    } else if (service === 'instagram') {
        return <a href={"https://instagram.com/" + username} target="_blank">{text}</a>
    }
}