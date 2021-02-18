import React, {useState, useCallback, useRef} from 'react';
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {Affix, Col, Form, Row, Select, Typography, Input, Radio} from "antd";
import Box from "@iso/components/utility/box";
import {ScholarshipSection} from "./Scholarships.styles";

export default function (props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(false)
    const [container, setContainer] = useState(null);
    const [top, setTop] = useState(10);
    const [grades, setGrades] = useState(10);
    const scholarshipAnswers = props.currentScholarship[props.scholarshipType];
    const scholarshipAdmin = props.currentScholarship["admin"];
    const scholarshipDates = props.currentScholarship["dates"][props.scholarshipType];
    const scholarshipProgress = props.currentScholarship["progress"][props.scholarshipType];
    const scholarshipSubmissions = props.currentScholarship["submissions"][props.scholarshipType];
    const scholarshipUrls = props.currentScholarship["urls"][props.scholarshipType];
    const getAppQuestionsTitle = (props.scholarshipType === "higherEdu") ? "The Mid-Rivers Higher Education Scholarship Questions" : "The Mid-Rivers Dawson Community College/Miles Community College Award Questions";
    const { Title } = Typography;
    let nextSchoolType = scholarshipAnswers.nextSchoolType;
    let workExperienceColumnSize = 24;

    const formLayout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 14,
        },
    };

    const onGradingFinish = () => {}

    const saveGrades = (value, key) => {
        console.log("save grade value:", value);
        console.log("save grade key:", key);
    }

    if(scholarshipAnswers.hasOwnProperty("nextSchoolType")) {
        if(scholarshipAnswers.nextSchoolType === "fourYearCollege") {
            nextSchoolType = "Four Year College";
        } else if(scholarshipAnswers.nextSchoolType === "techSchool") {
            nextSchoolType = "Technical School"
        } else if(scholarshipAnswers.nextSchoolType === "communityCollegeOther") {
            nextSchoolType = "Community College / Other"
        }
    }

    if(scholarshipAnswers.hasOwnProperty("employmentEmployerTwo")) {
        workExperienceColumnSize = 12;
    }

    if(scholarshipAnswers.hasOwnProperty("employmentEmployerThree")) {
        workExperienceColumnSize = 8;
    }

    return (
        <LayoutWrapper>
            <PageHeader>
                Sponsorship for {scholarshipAnswers.name}
            </PageHeader>
            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Personal Info</Title>
                        </ScholarshipSection>

                        <ScholarshipSection>
                            <div className="info-wrapper">
                                <div className="profile-image-wrapper">
                                    <img src={scholarshipUrls.profileImageUrl} alt={"profile image"}/>
                                </div>
                                <div className="userContent">
                                    <h2>{scholarshipAnswers.name}</h2>
                                    <div className="userAddress">
                                        <p>{scholarshipAnswers.address}</p>
                                        <p>{scholarshipAnswers.city}, {scholarshipAnswers.state} {scholarshipAnswers.zip}</p>
                                        <p>Telephone: {scholarshipAnswers.phone}</p>
                                        <p><a href={"mailto:"+scholarshipAnswers.email}>{scholarshipAnswers.email}</a></p>
                                        <p>Date of birth: {scholarshipAnswers.dob}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="biography">
                                <h3>Biography</h3>
                                <p>{scholarshipAnswers.biography}</p>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Midrivers Account Information</Title>
                            <div className="account-information">
                                <Row gutter={[16,16]} style={{"width": "100%"}}>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <h3>Account Number:</h3>
                                        <p>{scholarshipAnswers.midRiversAccount}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <h3>Members Name:</h3>
                                        <p>{scholarshipAnswers.membersName}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <h3>Relation to Member:</h3>
                                        <p>{scholarshipAnswers.memberRelation}</p>
                                    </Col>
                                </Row>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Current/Previous School Information</Title>
                            <div className="previous-schooling">
                                <Row gutter={[16,16]} style={{"width": "100%"}}>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>High School Attended or Currently Attending:</h3>
                                        <p>{scholarshipAnswers.highSchoolName}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>College Attended or Currently Attending:</h3>
                                        <p>{scholarshipAnswers.college !== "" ? scholarshipAnswers.college : "Not Applicable"}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>High School GPA:</h3>
                                        <p>{scholarshipAnswers.highSchoolGPA}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>College GPA:</h3>
                                        <p>{scholarshipAnswers.collegeGPA !== "" ? scholarshipAnswers.collegeGPA : "Not Applicable"}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>ACT/SAT Score:</h3>
                                        <p>{scholarshipAnswers.actScore}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Class Rank:</h3>
                                        <p>{scholarshipAnswers.classRank} of {scholarshipAnswers.classTotal}</p>
                                    </Col>
                                </Row>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>School/Community Activities and Awards</Title>
                            <div className="community-activities">
                                <div className="question-block">
                                    <h3>School Activities. Please provide years for each activity:</h3>
                                    <p>{scholarshipAnswers.schoolActivities}</p>
                                </div>
                                <div className="question-block">
                                    <h3>Community and Volunteer Activities:</h3>
                                    <p>{scholarshipAnswers.communityActivities}</p>
                                </div>
                                <div className="question-block">
                                    <h3>Awards and Honors Received:</h3>
                                    <p>{scholarshipAnswers.awardsAndHonors}</p>
                                </div>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Next Semester's School Information</Title>
                            <div className="next-school">
                                <Row gutter={[16,16]} style={{"width": "100%"}}>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Where do you plan on attending school next semester:</h3>
                                        <p>{nextSchoolType}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Field of Study:</h3>
                                        <p>{scholarshipAnswers.fieldOfStudy}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Name of School:</h3>
                                        <p>{scholarshipAnswers.nextSchoolName}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Admissions Phone Number:</h3>
                                        <p>{scholarshipAnswers.nextSchoolPhone}</p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 24}}>
                                        <h3>Admissions Address:</h3>
                                        <p>{scholarshipAnswers.nextSchoolAddress}</p>
                                        <p>{scholarshipAnswers.nextSchoolCity}, {scholarshipAnswers.nextSchoolState} {scholarshipAnswers.nextSchoolZip}</p>
                                    </Col>
                                </Row>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Work Experience</Title>
                            <div className="work-experience">
                                <Row gutter={[16,16]} style={{"width": "100%"}}>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: workExperienceColumnSize}} lg={{span: workExperienceColumnSize}}>
                                        <div className="employment-block">
                                            <h3>Employer:</h3>
                                            <p>{scholarshipAnswers.employmentEmployerOne}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Type:</h3>
                                            <p>{scholarshipAnswers.employmentTypeOne}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Position Title:</h3>
                                            <p>{scholarshipAnswers.employmentPositionTitleOne}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Dates:</h3>
                                            <p>From: {scholarshipAnswers.employmentEmployedFromOne} to {scholarshipAnswers.employmentEmployedToOne}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Weekly Hours:</h3>
                                            <p>{scholarshipAnswers.employmentWeeklyHoursOne}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Job Description:</h3>
                                            <p>{scholarshipAnswers.employmentJobDescriptionOne}</p>
                                        </div>
                                    </Col>

                                    {scholarshipAnswers.hasOwnProperty("employmentEmployerTwo") &&
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: workExperienceColumnSize}} lg={{span: workExperienceColumnSize}}>
                                        <div className="employment-block">
                                            <h3>Employer:</h3>
                                            <p>{scholarshipAnswers.employmentEmployerTwo}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Type:</h3>
                                            <p>{scholarshipAnswers.employmentTypeTwo}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Position Title:</h3>
                                            <p>{scholarshipAnswers.employmentPositionTitleTwo}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Dates:</h3>
                                            <p>From: {scholarshipAnswers.employmentEmployedFromTwo} to {scholarshipAnswers.employmentEmployedToTwo}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Weekly Hours:</h3>
                                            <p>{scholarshipAnswers.employmentWeeklyHoursTwo}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Job Description:</h3>
                                            <p>{scholarshipAnswers.employmentJobDescriptionTwo}</p>
                                        </div>
                                    </Col>
                                    }

                                    {scholarshipAnswers.hasOwnProperty("employmentEmployerThree") &&
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: workExperienceColumnSize}} lg={{span: workExperienceColumnSize}}>
                                        <div className="employment-block">
                                            <h3>Employer:</h3>
                                            <p>{scholarshipAnswers.employmentEmployerThree}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Type:</h3>
                                            <p>{scholarshipAnswers.employmentTypeThree}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Position Title:</h3>
                                            <p>{scholarshipAnswers.employmentPositionTitleThree}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Employment Dates:</h3>
                                            <p>From: {scholarshipAnswers.employmentEmployedFromThree} to {scholarshipAnswers.employmentEmployedToThree}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Weekly Hours:</h3>
                                            <p>{scholarshipAnswers.employmentWeeklyHoursThree}</p>
                                        </div>
                                        <div className="employment-block">
                                            <h3>Job Description:</h3>
                                            <p>{scholarshipAnswers.employmentJobDescriptionThree}</p>
                                        </div>
                                    </Col>
                                    }

                                </Row>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Essay Questions</Title>
                            <div className="essay-questions">
                                <div className="question-block">
                                    <h3>Describe your long-term education and career goals. What steps have you taken so far to accomplish these goals?:</h3>
                                    <p>{scholarshipAnswers.careerGoals}</p>
                                </div>

                                <div className="question-block">
                                    <h3>Describe an experience where you were unsuccessful in achieving your goal. What lessons did you learn from this experience?:</h3>
                                    <p>{scholarshipAnswers.unsuccessfulExperience}</p>
                                </div>

                                <div className="question-block">
                                    <h3>What would you describe to be your most unique or special skill that differentiates you from everyone else?:</h3>
                                    <p>{scholarshipAnswers.uniqueSkill}</p>
                                </div>

                                <div className="question-block">
                                    <h3>Recognizing that technology changes at the speed of light, describe a technology that you think has had the most positive impact on our world today, and why.</h3>
                                    <p>{scholarshipAnswers.techChanges}</p>
                                </div>

                                <div className="question-block">
                                    <h3>Do you see yourself returning to the area after graduation? What about living in this area appeals to you?:</h3>
                                    <p>{scholarshipAnswers.livingInMontana}</p>
                                </div>

                                {props.scholarshipType === "dcc" &&
                                <div className="question-block">
                                    <h3>Pick a problem facing the area you live in. Describe in detail how you would use your future education to find a solution.:</h3>
                                    <p>{scholarshipAnswers.areaProblem}</p>
                                </div>
                                }
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Required Documents</Title>
                            <div className="essay-questions">
                                <Row gutter={[16,16]} style={{"width": "100%"}}>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <p><a href={scholarshipUrls.profileImageUrl} target="_blank">Profile Image</a></p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <p><a href={scholarshipUrls.transcriptsUrl} target="_blank">Transcripts</a></p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <p><a href={scholarshipUrls.referenceLetterUrl} target="_blank">Reference Letter</a></p>
                                    </Col>
                                </Row>
                            </div>
                        </ScholarshipSection>
                    </Box>
                </Col>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}  ref={setContainer}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Grading</Title>
                            <Form {...formLayout} layout="vertical" name="grading-form" onFinish={onGradingFinish}>
                                <div className="general">
                                    <h3>General</h3>
                                    <Form.Item label="Member">
                                        <Radio.Group onChange={(e) => {saveGrades(e.target.value, "isMember")}}>
                                            <Radio.Button value={"yes"}>Yes</Radio.Button>
                                            <Radio.Button value={"no"}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item label="Past Winner">
                                        <Radio.Group onChange={(e) => {saveGrades(e.target.value, "pastWinner")}}>
                                            <Radio.Button value={"yes"}>Yes</Radio.Button>
                                            <Radio.Button value={"no"}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>

                                <div className="grades">
                                    <h3>Grades</h3>
                                    <Form.Item label="GPA">
                                        <Select className={"gpa"} onChange={(v) => {saveGrades(v, "gpa")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                            <Select.Option value="5">5</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="ACT">
                                        <Select className={"act"} onChange={(v) => {saveGrades(v, "act")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Rank">
                                        <Select className={"rank"} onChange={(v) => {saveGrades(v, "rank")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="activities-and-awards">
                                    <h3>Activities & Awards</h3>
                                    <Form.Item label="School Related">
                                        <Select className={"school"} onChange={(v) => {saveGrades(v, "schoolRelated")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Community">
                                        <Select className={"community"} onChange={(v) => {saveGrades(v, "community")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Awards & Honors">
                                        <Select className={"awards"} onChange={(v) => {saveGrades(v, "awards")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="work-history">
                                    <h3>Work History</h3>
                                    <Form.Item label="Employment">
                                        <Select className={"employment"} onChange={(v) => {saveGrades(v, "employment")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                            <Select.Option value="5">5</Select.Option>
                                            <Select.Option value="6">6</Select.Option>
                                            <Select.Option value="7">7</Select.Option>
                                            <Select.Option value="8">8</Select.Option>
                                            <Select.Option value="9">9</Select.Option>
                                            <Select.Option value="10">10</Select.Option>
                                            <Select.Option value="11">11</Select.Option>
                                            <Select.Option value="12">12</Select.Option>
                                            <Select.Option value="13">13</Select.Option>
                                            <Select.Option value="14">14</Select.Option>
                                            <Select.Option value="15">15</Select.Option>
                                            <Select.Option value="16">16</Select.Option>
                                            <Select.Option value="17">17</Select.Option>
                                            <Select.Option value="18">18</Select.Option>
                                            <Select.Option value="19">19</Select.Option>
                                            <Select.Option value="20">20</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="essays">
                                    <h3>Essays</h3>
                                    <Form.Item label="Content">
                                        <Select className={"content"} onChange={(v) => {saveGrades(v, "essays")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="0">1</Select.Option>
                                            <Select.Option value="0">2</Select.Option>
                                            <Select.Option value="0">3</Select.Option>
                                            <Select.Option value="0">4</Select.Option>
                                            <Select.Option value="0">5</Select.Option>
                                            <Select.Option value="0">6</Select.Option>
                                            <Select.Option value="0">7</Select.Option>
                                            <Select.Option value="0">8</Select.Option>
                                            <Select.Option value="0">9</Select.Option>
                                            <Select.Option value="0">10</Select.Option>
                                            <Select.Option value="0">11</Select.Option>
                                            <Select.Option value="0">12</Select.Option>
                                            <Select.Option value="0">13</Select.Option>
                                            <Select.Option value="0">14</Select.Option>
                                            <Select.Option value="0">15</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Grammar">
                                        <Select className={"grammar"} onChange={(v) => {saveGrades(v, "grammar")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="0">1</Select.Option>
                                            <Select.Option value="0">2</Select.Option>
                                            <Select.Option value="0">3</Select.Option>
                                            <Select.Option value="0">4</Select.Option>
                                            <Select.Option value="0">5</Select.Option>
                                            <Select.Option value="0">6</Select.Option>
                                            <Select.Option value="0">7</Select.Option>
                                            <Select.Option value="0">8</Select.Option>
                                            <Select.Option value="0">9</Select.Option>
                                            <Select.Option value="0">10</Select.Option>
                                            <Select.Option value="0">11</Select.Option>
                                            <Select.Option value="0">12</Select.Option>
                                            <Select.Option value="0">13</Select.Option>
                                            <Select.Option value="0">14</Select.Option>
                                            <Select.Option value="0">15</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="area">
                                    <h3>Area</h3>
                                    <Form.Item label="Return to Area">
                                        <Select className={"content"} onChange={(v) => {saveGrades(v, "returnToArea")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                            <Select.Option value="5">5</Select.Option>
                                            <Select.Option value="6">6</Select.Option>
                                            <Select.Option value="7">7</Select.Option>
                                            <Select.Option value="8">8</Select.Option>
                                            <Select.Option value="9">9</Select.Option>
                                            <Select.Option value="10">10</Select.Option>
                                            <Select.Option value="11">11</Select.Option>
                                            <Select.Option value="12">12</Select.Option>
                                            <Select.Option value="13">13</Select.Option>
                                            <Select.Option value="14">14</Select.Option>
                                            <Select.Option value="15">15</Select.Option>
                                            <Select.Option value="16">16</Select.Option>
                                            <Select.Option value="17">17</Select.Option>
                                            <Select.Option value="18">18</Select.Option>
                                            <Select.Option value="19">19</Select.Option>
                                            <Select.Option value="20">20</Select.Option>
                                            <Select.Option value="21">21</Select.Option>
                                            <Select.Option value="22">22</Select.Option>
                                            <Select.Option value="23">23</Select.Option>
                                            <Select.Option value="24">24</Select.Option>
                                            <Select.Option value="25">25</Select.Option>
                                            <Select.Option value="26">26</Select.Option>
                                            <Select.Option value="27">27</Select.Option>
                                            <Select.Option value="28">28</Select.Option>
                                            <Select.Option value="29">29</Select.Option>
                                            <Select.Option value="30">30</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Form>

                            <div className="points-total">
                                <p>xxx points</p>
                            </div>
                        </ScholarshipSection>
                    </Box>
                </Col>
            </Row>
        </LayoutWrapper>
    )
}