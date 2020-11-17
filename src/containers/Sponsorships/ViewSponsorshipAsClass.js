import React, {Component} from 'react';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import {sponsorshipSingleViewColumns} from "../Tables/AntTables/configs";
import TableWrapper from "@iso/containers/Tables/AntTables/AntTables.styles";
import {Row, Col, Button, Form, Select, Input, Space} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {ApplicationSection} from "./Sponsorships.styles";

export default class ViewSponsorship extends Component {
    constructor(props) {
        super(props);

       this.state = {
            currentSponsorship: this.props.currentSponsorship,
            submitting: false,
        }

        this.setFieldInState = this.setFieldInState.bind(this);
        this.setSelectInState = this.setSelectInState.bind(this);
        this.setMaterialItemsInState = this.setMaterialItemsInState.bind(this);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            currentSponsorship: this.props.currentSponsorship
        })

        console.log("props:", this.props);
    }

    setFieldInState = (e) => {
        this.setState({
            ...this.state,
            currentSponsorship: {
                ...this.state.currentSponsorship,
                admin: {
                    ...this.state.currentSponsorship.admin,
                    [e.target.name]: e.target.value
                }
            }
        }, () => {
            console.log("state: ", this.state);
            console.log("admin state: ", this.state.currentSponsorship.admin);
        });

    }

    setSelectInState = (e) => {
        console.log("check field e:", e);
        console.log("application:", this.props.currentSponsorship);

        this.setState({
            ...this.state,
            currentSponsorship: {
                ...this.state.currentSponsorship,
                admin: {
                    ...this.state.currentSponsorship.admin,
                    approvalStatus: e
                }
            }
        }, () => {
            console.log("state: ", this.state);
            console.log("admin state: ", this.state.currentSponsorship);
        });
    }

    setMaterialItemsInState = (e) => {
        console.log("setMaterialItemsInState e: ", e);
    }

    submitApplication = (values, appType) => {
        console.log("state: ", this.state);
        console.log('Received values of form:', values);
        console.log('Received appType of form:', appType);

        if(appType === "Monetary") {
            this.setState({
                ...this.state,
                currentSponsorship: {
                    ...this.state.currentSponsorship,
                    admin: {
                        ...this.state.currentSponsorship.admin,
                        amountApproved: values.amountApproved,
                        notes: values.notes,
                        statusSelect: values.statusSelect
                    }
                },
                submitting: true,
            }, () => {

            })
        } else {
            this.setState({
                ...this.state,
                currentSponsorship: {
                    ...this.state.currentSponsorship,
                    admin: {
                        ...this.state.currentSponsorship.admin,
                        itemsApproved: values.itemsApproved,
                        notes: values.notes,
                        statusSelect: values.statusSelect
                    }
                },
                submitting: true,
            }, () => {

            })
        }


    }

    sendApplicantEmail = () => {}

    render() {

        const { Option } = Select;
        const currentSponsorship = this.state.currentSponsorship;
        let submissionInfo = currentSponsorship.submission;
        const appType = submissionInfo.sponsorshipSelect;
        let appTypeFieldsToShow = "";

        if(!submissionInfo) {
            submissionInfo = "";
        }

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
                            placeholder="0.00" value={this.state.currentSponsorship.admin.amountApproved}
                            onChange={this.setFieldInState}
                        />
                    </Form.Item>
                </div>
            )
        } else {
            appTypeFieldsToShow =  (
                <div className="form-group">
                    <h3 className="group-title">Material</h3>
                    <Form.List name="items" onChange={this.setMaterialItemsInState}>
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
                                                    <Input placeholder="Item Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'itemQty']}
                                                    className={"itemQty"}
                                                    fieldKey={[field.fieldKey, 'itemQty']}
                                                    rules={[{ required: true, message: 'Missing Item Quantity' }]}
                                                >
                                                    <Input placeholder="Qty" />
                                                </Form.Item>

                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            </Space>
                                        )
                                    )}

                                    <Form.Item>
                                        <Button
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
            )
        }

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
                answer: submissionInfo.orgAddress,
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
                answer: socialLink("twitter", submissionInfo.orgTwitter),
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
                answer: submissionInfo.primaryAddress,
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
                key: submissionInfo.sponsorshipSelect === "monetary" ? 'eventMoney' : "eventItems",
                question: submissionInfo.sponsorshipSelect === "monetary" ? 'Amount Requested' : "Items Requested",
                answer: submissionInfo.sponsorshipSelect === "monetary" ? submissionInfo.eventMoney : submissionInfo.eventItems,
                dataIndex: submissionInfo.sponsorshipSelect === "monetary" ? 'eventMoney' : "eventItems"
            },

            {
                key: submissionInfo.sponsorshipSelect === "monetary" ? 'eventMoneyDate' : "eventItemsDate",
                question: submissionInfo.sponsorshipSelect === "monetary" ? 'Amount Requested' : "Items Requested",
                answer: submissionInfo.sponsorshipSelect === "monetary" ? submissionInfo.eventMoneyDate : submissionInfo.eventItemsDate,
                dataIndex: submissionInfo.sponsorshipSelect === "monetary" ? 'eventMoneyDate' : "eventItemsDate"
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

        return (
            <LayoutWrapper>
                <Row gutter={[16,16]} style={{"width": "100%"}}>
                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
                        <Box style={{ padding: 20 }}>
                            <ApplicationSection>
                                <h2 className={"application-section-title"}>Organization Information</h2>
                                <TableWrapper
                                    pagination={false}
                                    columns={sponsorshipSingleViewColumns}
                                    dataSource={orgInfo}
                                    className="isoSimpleTable"
                                    bordered
                                />
                            </ApplicationSection>

                            <ApplicationSection>
                                <h2 className={"application-section-title"}>Primary Information</h2>
                                <TableWrapper
                                    pagination={false}
                                    columns={sponsorshipSingleViewColumns}
                                    dataSource={primaryInfo}
                                    className="isoSimpleTable"
                                    bordered
                                />
                            </ApplicationSection>

                            <ApplicationSection>
                                <h2 className={"application-section-title"}>Event Information</h2>
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
                        <Box style={{ padding: 20 }}>
                            <ApplicationSection>
                                <h2 className={"application-section-title"}>Admin Tools</h2>
                                <section className={"admin-section"}>
                                    <p>Current Status: <span className={'status'}>{currentSponsorship.admin.approvalStatus}</span></p>
                                </section>
                                <section className={"admin-section"}>
                                    <Form name="admin-form" layout="vertical" size={"default"}  onFinish={(values) => {this.submitApplication(values, appType)}}
                                          initialValues={{
                                              amountApproved: currentSponsorship.admin.amountApproved !== 0 ? currentSponsorship.admin.amountApproved : "",
                                              statusSelect: currentSponsorship.admin.approvalStatus,
                                              notes: currentSponsorship.admin.notes,
                                          }}
                                    >

                                        {appTypeFieldsToShow}

                                        <Form.Item
                                            name="notes"
                                            label="Application Notes">
                                            <Input.TextArea
                                                name="notes"
                                                label={"Application Notes"}
                                                rows={5}
                                                onChange={this.setFieldInState}
                                            />
                                        </Form.Item>

                                        <Row className={"btn-row"}>
                                            <Col span={24}>
                                                <Button className={"btn email-followup"} type="default" size={"large"}>Email Followup</Button>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="statusSelect"
                                            label="Set Status">
                                            <Select placeholder={"Status"} name="statusSelect" onChange={e => this.setSelectInState(e)}>
                                                <Option value="pending">Pending</Option>
                                                <Option value="approved">Approved</Option>
                                                <Option value="denied">Denied</Option>
                                            </Select>
                                        </Form.Item>

                                        <Row className={"btn-row"}>
                                            <Col span={12}>
                                                <Button htmlType="submit" className={"btn submit"} loading={this.state.submitting} type="primary" size={"large"}>Submit</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </section>
                            </ApplicationSection>
                        </Box>
                    </Col>
                </Row>
            </LayoutWrapper>
        );


    }
}

function socialLink(service, text) {
    if (service === 'twitter') {
        return <a href={"https://twitter.com/" + text}>text</a>
    } else if (service === 'instagram') {
        return <a href={"https://instagram.com/" + text}>text</a>
    }
}