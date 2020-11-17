import React, {useState, useCallback, useEffect, useRef} from 'react';
import ReactDomServer from 'react-dom/server';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import {sponsorshipSingleViewColumns} from "../Tables/AntTables/configs";
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import {Row, Col, Button, Form, Select, Input, Space, Typography} from 'antd';
import {BoldOutlined, ItalicOutlined, MinusCircleOutlined, PlusOutlined, UnderlineOutlined} from '@ant-design/icons';
import {ApplicationSection} from "./Sponsorships.styles";
import sponsorshipActions from "../../redux/sponsorships/actions";
import sponsorshipsReducer from "../../redux/sponsorships/reducer";
import Draft, {Editor, EditorState, RichUtils, ContentState, convertFromHTML, convertToRaw, getSafeBodyFromHTML} from 'draft-js';
import Immutable from 'immutable';
import 'draft-js/dist/Draft.css';
import * as firebase from "firebase";

export default function (props) {
    // if an email was sent, just get out of here.
    if(props.emailSent) {
        //return <Redirect to={props.redirectPath} />;
    } else {
        // console.log("VIEW SPONSORSHIP currentApp:", currentApp);
        // console.log("VIEW SPONSORSHIP emailSent:", props.emailSent);
    }

    const [currentApp, setCurrentApp] = useState(props.currentSponsorship);
    const [loading, setLoading] = useState(props.loading);
    const [formItems, setFormItems] = useState(null);
    const [editorState, setEditorState] = useState(null);
    const [emailPreview, setEmailPreview] = useState(null);
    let email = "";
    let applicantEmailPreview = null;
    const submissionInfo = currentApp.submission;
    const appType = submissionInfo.sponsorshipSelect;
    const dispatch = useDispatch();
    const { Option } = Select;
    const { Title } = Typography;
    const editorButtonSize = "default";
    let appTypeFieldsToShow = "";
    let approvalDate = "";
    let existingItems = null;

    const orgAddress = (
        <span>{submissionInfo.orgAddress + <br /> + submissionInfo.orgCity + ", " + submissionInfo.orgZip}</span>
    );

    const orgInfo = [
        {
            key: "organization",
            question: "Are You requesting as an Organization or Individual?",
            answer: "Organization",
            dataIndex: "organization"
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
            answer: <a href={`$[submissionInfo.orgWebsite]`} target="_blank">{submissionInfo.orgWebsite}</a>,
            dataIndex: "orgWebsite"
        },
        {
            key: "orgFacebook",
            question: "Organization's Facebook Page",
            answer: <a href={`$[submissionInfo.orgFacebook]`} target="_blank">{submissionInfo.orgFacebook}</a>,
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
            answer: submissionInfo.primaryAddress  + <br /> + submissionInfo.primaryCity + ", " + submissionInfo.primaryZip,
            dataIndex: "primaryAddress"
        },
        {
            key: "relationship",
            question: "Title/Relationship to Organization/Individual",
            answer: submissionInfo.relationship,
            dataIndex: "relationship"
        },
    ];
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
        (currentApp, emailArray) => dispatch(sponsorshipActions.sendEmail(currentApp, emailArray)), [dispatch]
    );

    // gets the editor contents and triggers the sendApplication function
    const emailApplicant = (currentApp) => {
        const contentState = editorState.getCurrentContent();
        const blocksArray = contentState.getBlocksAsArray();
        let emailArray = [];

        console.log("convertToRaw", convertToRaw(contentState));

        for(let idx in blocksArray) {
            let contentBlock = blocksArray[idx];
            emailArray.push(contentBlock.getText());
            //console.log("emailApplicant key:", contentBlock.getKey(), ", Type:", contentBlock.getType(), ", Depth:", contentBlock.getDepth());
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
                                                <Input placeholder="Item Name" disabled={currentApp.admin.notificationEmailed}/>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'itemQty']}
                                                className={"itemQty"}
                                                fieldKey={[field.fieldKey, 'itemQty']}
                                                rules={[{ required: true, message: 'Missing Item Quantity' }]}
                                            >
                                                <Input placeholder="Qty" disabled={currentApp.admin.notificationEmailed}/>
                                            </Form.Item>

                                            {!currentApp.admin.notificationEmailed &&
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
                                        disabled={currentApp.admin.notificationEmailed}
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
    if(currentApp.admin.approvalStatus === "approved") {
        approvalDate = (
            <p className={'approvalDate approved'}>Approved on: <span className={'date'}>{
                currentApp.admin.approvalDate.toDate().getMonth()+1 + "/" +
                currentApp.admin.approvalDate.toDate().getDate() + "/" +
                currentApp.admin.approvalDate.toDate().getFullYear()}</span></p>
        )
    } else if(currentApp.admin.approvalStatus === 'denied') {
        approvalDate = (
            <p className={'approvalDate denied'}>Denied on: <span className={'date'}>{
                currentApp.admin.approvalDate.toDate().getMonth()+1 + "/" +
                currentApp.admin.approvalDate.toDate().getDate() + "/" +
                currentApp.admin.approvalDate.toDate().getFullYear()}</span></p>
        )
    }

    // Preview the email being sent
    const previewEmail = (passedApp) => {
        if(appType === "Monetary") {
            if(passedApp.admin.approvalStatus === "approved") {
                // applicantEmailPreview = (
                //     <div className={'applicant-email-preview'}>
                //         <h3>Dear {submissionInfo.primaryName}</h3>
                //         <p>Thank you for submitting the Community Sponsorship Request form. We are pleased to inform you that your sponsorship request has been approved for ${}. We will send your check to the address provided in the form. Please allow for 1-2 weeks for the check to arrive. If you have any questions or need additional information, please contact Nicole Senner at <a href="tel:4066877387">406-687-7387</a> or<a href="mailto:nicole.senner@midrivers.coop">nicole.senner@midrivers.coop</a></p>
                //     </div>
                // )

            } else if(passedApp.admin.approvalStatus === "denied") {

            }
        } else {
            if(passedApp.admin.approvalStatus === "approved") {
                // create the items string for the editor preview
                let itemsTextArray = [];

                if(existingItems.length) {
                    for (let idx in existingItems) {
                        if(parseInt(idx) === existingItems.length - 1) {
                            itemsTextArray.push("and " + existingItems[idx].itemQty + "x" + existingItems[idx].itemName);
                        } else {
                            itemsTextArray.push(existingItems[idx].itemQty + "x" + existingItems[idx].itemName);
                        }
                    }
                }

                // set the default email to show in the editor
                applicantEmailPreview = (
                    <>
                        <p>Dear {submissionInfo.primaryName},</p>
                        <p>Thank you for submitting the Community Sponsorship Request form. We are pleased to inform you
                            that your sponsorship request has been approved for the following items:</p>
                        <p>{itemsTextArray.join(', ')}.</p>
                        <p>Please contact Nicole Senner at <a href="tel:4066877387">406-687-7387</a> or <a href="mailto:nicole.sennern@midrivers.coop">nicole.sennern@midrivers.coop</a> to coordinate the delivery of the items or if you have any questions.</p>
                    </>
                );
            } else if(passedApp.admin.approvalStatus === "denied") {
            }
        }

        const blocksFromHTML = convertFromHTML(ReactDomServer.renderToString(applicantEmailPreview));
        //const blocksFromHTML = convertFromHTML(ReactDomServer.renderToString(applicantEmailPreview), getSafeBodyFromHTML);
        // console.log("applicantEmailPreview", applicantEmailPreview);
        // console.log("applicantEmailPreview renderToString", ReactDomServer.renderToString(applicantEmailPreview));
        // console.log("blocksFromHTML", blocksFromHTML);


        const initialContent = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        setEmailPreview(ReactDomServer.renderToString(applicantEmailPreview));
        setEditorState(EditorState.createWithContent(initialContent));


    };

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

            setFormItems(formValues.items);
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

        console.log("sending to updateApp: ", updatedApp);
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



    // draftjs custom block rendering tags for when you enter to make a new line
    const blockRenderMap = Immutable.Map({

    });

    // draftjs this sets the custom blocks in the editors backend html output
    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

    return (
        <LayoutWrapper>
            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
                    {editorState !== null &&
                    <Box style={{padding: 20, height: 'auto'}} className={"email-preview"}>
                        <ApplicationSection>
                            <div className="editor-wrapper">
                                <div className="editor-buttons">
                                    <p>You can edit the text below.</p>
                                </div>
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                    handleKeyCommand={handleKeyCommand}
                                    spellCheck={true}
                                    blockRenderMap={extendedBlockRenderMap}
                                />
                            </div>
                            <Row gutter={[0, 0]}>
                                <Col xs={{span: 24}}>
                                    <div className="send-email-button-wrapper">
                                        <Button className={"btn send-email-to-email-applicant"} loading={loading}
                                                type="primary" size={"large"}
                                                disabled={currentApp.admin.approvalStatus === 'pending'}
                                                onClick={(e) => {
                                                    emailApplicant(currentApp)
                                                }}
                                        >Send Email</Button>
                                    </div>
                                </Col>
                            </Row>

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
                                <p className={'notification-status'}>The applicant has {!props.emailSent && "not "}been notified.</p>
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
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="statusSelect"
                                        label={<h3 className="group-title">Set Application Status</h3>}>
                                        <Select placeholder={"Status"} name="statusSelect" disabled={currentApp.admin.notificationEmailed}>
                                            <Option value="pending">Pending</Option>
                                            <Option value="approved">Approved</Option>
                                            <Option value="denied">Denied</Option>
                                        </Select>
                                    </Form.Item>

                                    <Row className={"btn-row"}>
                                        <Col span={12}>
                                            <Button htmlType="submit" className={"btn submit"} loading={loading} type="primary" size={"large"} disabled={currentApp.admin.notificationEmailed}>Save</Button>
                                        </Col>

                                        <Col span={12}>
                                            {!currentApp.admin.notificationEmailed ?
                                                <Button className={"btn preview-email-applicant"} loading={loading}
                                                        type="default" size={"large"}
                                                        disabled={currentApp.admin.approvalStatus === 'pending'}
                                                        onClick={(e) => {previewEmail(currentApp)}}
                                                >Preview Email</Button>
                                                :
                                                <p>Applicant has been emailed of decision. No further changes can be made.</p>
                                            }
                                        </Col>

                                        {currentApp.admin.notificationEmailed && <Col span={24}><p className={"applicantNotified"}>This applicant has been notified and the application cannot be changed.</p></Col>}
                                    </Row>
                                </Form>
                            </section>
                        </ApplicationSection>
                    </Box>
                </Col>
            </Row>
        </LayoutWrapper>
    )
}

function socialLink(service, text) {
    let username = text;

    if (text.includes("@")) {
        username = text.replace("@", "");
    }
    if (service === 'twitter') {
        return <a href={"https://twitter.com/" + username}>{text}</a>
    } else if (service === 'instagram') {
        return <a href={"https://instagram.com/" + username}>{text}</a>
    }
}