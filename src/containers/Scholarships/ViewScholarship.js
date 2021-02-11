import React, {useState, useCallback, useRef} from 'react';
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {Affix, Col, Form, Row, Select, Typography} from "antd";
import Box from "@iso/components/utility/box";
import {ScholarshipSection} from "./Scholarships.styles";

export default function (props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(false)
    const [container, setContainer] = useState(null);
    const [top, setTop] = useState(10);
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
            span: 16,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const onGradingFinish = () => {}

    console.log("scholarshipAnswers", scholarshipAnswers);
    console.log("scholarshipUrls", scholarshipUrls);
    console.log("profileImageUrl", scholarshipUrls.profileImageUrl);

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
                                <Form.Item label="Personal Info">
                                    <Select className={"personal-info"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Account Info">
                                    <Select className={"account-info"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Current School Info">
                                    <Select className={"current-school-info"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Next School Info">
                                    <Select className={"next-school-info"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Work Experience">
                                    <Select className={"work-experience"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Essay Questions">
                                    <Select className={"essay-questions"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Required Documents">
                                    <Select className={"docs"}>
                                        <Select.Option value="0">0</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                        <Select.Option value="15">15</Select.Option>
                                        <Select.Option value="20">20</Select.Option>
                                        <Select.Option value="25">25</Select.Option>
                                        <Select.Option value="30">30</Select.Option>
                                        <Select.Option value="35">35</Select.Option>
                                        <Select.Option value="40">40</Select.Option>
                                    </Select>
                                </Form.Item>
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