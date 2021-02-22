import React, {useState, useCallback, useRef, useEffect} from 'react';
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import IntlMessages from "@iso/components/utility/intlMessages";
import PageHeader from "@iso/components/utility/pageHeader";
import {Affix, Col, Form, Row, Select, Typography, Input, Radio, Button} from "antd";
import Box from "@iso/components/utility/box";
import {ScholarshipSection} from "./Scholarships.styles";
import NoImage from '@iso/assets/images/no-image.png';
import {CloseOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import scholarshipActions from "../../redux/scholarships/actions";

export default function (props) {
    const dispatch = useDispatch();
    const [currentApplicationStatus, setCurrentApplicationStatus] = useState(false)
    const [container, setContainer] = useState(null);
    const [top, setTop] = useState(10);
    const [totalPoints, setTotalPoints] = useState(null);
    const scholarshipAnswers = props.currentScholarship[props.scholarshipType];
    const scholarshipProgress = props.currentScholarship["progress"][props.scholarshipType];
    const scholarshipSubmissions = props.currentScholarship["submissions"][props.scholarshipType];
    const scholarshipUrls = props.currentScholarship["urls"][props.scholarshipType];
    const sponsorshipName = (props.scholarshipType === "higherEdu") ? "The Mid-Rivers Higher Education Scholarship" : "The Mid-Rivers Dawson Community College/Miles Community College Award";
    const [grades, setGrades] = useState(props.currentScholarship["admin"].grades);
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

    const updateGrades = useCallback(
        (id, grades) => dispatch(scholarshipActions.updateScholarshipPoints(id, grades)),
        [dispatch]
    );

    const savePoints = (value, key) => {
        // console.log("setGrades key: ", key);
        setGrades({
           ...grades,
           points: {
               ...grades.points,
               [key]: parseInt(value)
           }
        });

        updateGrades(props.userId,  {
            ...grades,
            points: {
                ...grades.points,
                [key]: parseInt(value)
            }
        })
    }

    const saveQuestions = (value, key) => {
        // console.log("setGrades key: ", key);
        setGrades({
            ...grades,
            [key]: parseInt(value)
        });

        updateGrades(props.userId,  {
            ...grades,
            [key]: value
        })
    }

    const calculatePoints = (points) => {
        let total = 0;

        for(let point in points) {
            total += points[point];
        }

        return total;
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
                {sponsorshipName} for {scholarshipAnswers.name}
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
                                    <img src={scholarshipUrls.profileImageUrl ? scholarshipUrls.profileImageUrl : NoImage} alt={"profile image"}/>
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
                                        <p>
                                            {scholarshipUrls.profileImageUrl
                                                ? <a href={scholarshipUrls.profileImageUrl} target="_blank">Profile Image</a>
                                                : <span className={"no-document"}><CloseOutlined />No Profile Image</span>
                                            }

                                        </p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <p>
                                            {scholarshipUrls.transcriptsUrl
                                                ? <a href={scholarshipUrls.transcriptsUrl} target="_blank">Transcripts</a>
                                                : <span className={"no-document"}><CloseOutlined />No Transcripts</span>
                                            }

                                        </p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        {scholarshipUrls.referenceLetterUrl
                                            ? <a href={scholarshipUrls.referenceLetterUrl} target="_blank">Reference Letter</a>
                                            : <span className={"no-document"}><CloseOutlined />No Reference Letter</span>
                                        }
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
                                        <Radio.Group defaultValue={grades.isMember} onChange={(e) => {saveQuestions(e.target.value, "isMember")}}>
                                            <Radio.Button value={"yes"}>Yes</Radio.Button>
                                            <Radio.Button value={"no"}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item label="Past Winner">
                                        <Radio.Group defaultValue={grades.pastWinner} onChange={(e) => {saveQuestions(e.target.value, "pastWinner")}}>
                                            <Radio.Button value={"yes"}>Yes</Radio.Button>
                                            <Radio.Button value={"no"}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>

                                <div className="grades">
                                    <h3>Grades</h3>
                                    <Form.Item label="GPA">
                                        <Select className={"gpa"} defaultValue={parseInt(grades.points.gpa) !== 0 && grades.points.gpa} key={"gpa"} onChange={(v) => {savePoints(v, "gpa")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                            <Select.Option value="5">5</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="ACT">
                                        <Select className={"act"} defaultValue={parseInt(grades.points.act) !== 0 && grades.points.act} key={"act"} onChange={(v) => {savePoints(v, "act")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Rank">
                                        <Select className={"rank"} defaultValue={parseInt(grades.points.rank) !== 0 && grades.points.rank} key={"rank"} onChange={(v) => {savePoints(v, "rank")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="activities-and-awards">
                                    <h3>Activities & Awards</h3>
                                    <Form.Item label="School Related">
                                        <Select className={"school"} defaultValue={parseInt(grades.points.schoolRelated) !== 0 && grades.points.schoolRelated} onChange={(v) => {savePoints(v, "schoolRelated")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Community">
                                        <Select className={"community"} defaultValue={parseInt(grades.points.community) !== 0 && grades.points.community} key={"community"} onChange={(v) => {savePoints(v, "community")}}>
                                            <Select.Option value="0">0</Select.Option>
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="2">2</Select.Option>
                                            <Select.Option value="3">3</Select.Option>
                                            <Select.Option value="4">4</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Awards & Honors">
                                        <Select className={"awards"} defaultValue={parseInt(grades.points.awards) !== 0 && grades.points.awards} key={"awards"} onChange={(v) => {savePoints(v, "awards")}}>
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
                                        <Select className={"employment"} defaultValue={parseInt(grades.points.employment) !== 0 && grades.points.employment} key={"employment"} onChange={(v) => {savePoints(v, "employment")}}>
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
                                        <Select className={"content"} defaultValue={parseInt(grades.points.essays) !== 0 && grades.points.essays} key={"essays"} onChange={(v) => {savePoints(v, "essays")}}>
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
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Grammar">
                                        <Select className={"grammar"} defaultValue={parseInt(grades.points.grammar) !== 0 && grades.points.grammar} key={"grammar"} onChange={(v) => {savePoints(v, "grammar")}}>
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
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="area">
                                    <h3>Area</h3>
                                    <Form.Item label="Return to Area">
                                        <Select className={"content"} key={"area"} defaultValue={parseInt(grades.points.area) !== 0 && grades.points.area} onChange={(v) => {savePoints(v, "returnToArea")}}>
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
                                <h3>{calculatePoints(grades.points)} points</h3>
                            </div>

                            <div className="save">
                                <Button type="primary">Save</Button>
                            </div>
                        </ScholarshipSection>
                    </Box>
                </Col>
            </Row>
        </LayoutWrapper>
    )
}