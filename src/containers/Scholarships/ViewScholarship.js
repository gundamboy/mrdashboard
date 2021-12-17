import React, {useState, useCallback, useRef, useEffect} from 'react';
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import PageHeader from "@iso/components/utility/pageHeader";
import {Col, Form, Row, Select, Typography, Input, Radio, Button, Space, Checkbox, Alert} from "antd";
import Box from "@iso/components/utility/box";
import {EditorControls, EditorWrapper, ScholarshipSection, ScholarshipStatusHeader} from "./Scholarships.styles";
import NoImage from '@iso/assets/images/no-image.png';
import {CloseOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import scholarshipActions from "../../redux/scholarships/actions";
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';
import ReactDomServer from "react-dom/server";

export default function (props) {
    const dispatch = useDispatch();
    const editor = useRef(null);
    const [editorState, setEditorState] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [enableScholarshipDelete, setEnableScholarshipDelete] = useState(false);
    const [container, setContainer] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const scholarshipAnswers = props.currentScholarship[props.scholarshipType];
    const admin = props.currentScholarship.admin;
    const scholarshipUrls = props.currentScholarship["urls"][props.scholarshipType];
    const sponsorshipName = (props.scholarshipType === "higherEdu") ? "The Mid-Rivers Higher Education Scholarship" : "The Mid-Rivers Dawson Community College/Miles Community College Award";
    const applicantNotified = admin.applicantNotified[props.scholarshipType];
    const [approvalStatus, setApprovalStatus] = useState(props.currentScholarship.admin.approvalStatus[props.scholarshipType]);
    const [grades, setGrades] = useState(props.currentScholarship["admin"].grades);
    const [notes, setNotes] = useState(props.notes);
    const { Title } = Typography;
    const { TextArea } = Input;
    let nextSchoolType = scholarshipAnswers.nextSchoolType;
    let workExperienceColumnSize = 24;
    let profileImageUrl = scholarshipUrls.profileImageUrl;
    let transcriptsUrl = scholarshipUrls.transcriptsUrl;
    let letterUrl = scholarshipUrls.referenceLetterUrl;

    if(admin.applicantNotified[props.scholarshipType]) {
        if(emailSending === true) {
            setShowPreview(false);
            setEmailSending(false);
        }
    }

    if(!profileImageUrl) {
        profileImageUrl = scholarshipAnswers.profileImage;
    }

    if(!transcriptsUrl) {
        transcriptsUrl = scholarshipAnswers.transcripts;
    }

    if(!letterUrl) {
        letterUrl = scholarshipAnswers.letter;
    }

    const formLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 10,
        },
    };

    const onFormsFinish = () => {}

    const sendApplicationEmail = useCallback(
        (userEmail, emailTextArray, userId, name, scholarshipType, status) => dispatch(scholarshipActions.sendScholarshipEmail(userEmail, emailTextArray, userId, name, scholarshipType, status)),
        [dispatch]
    );

    const removeScholarship = useCallback(
        (documentId, appType, member, pastWinner, grades, notes, approval) => dispatch(scholarshipActions.deleteScholarship(documentId, appType, member, pastWinner, grades, notes, approval)),
        [dispatch]
    );

    const saveApplication = useCallback(
        (documentId, userId, appType, grades, notes, approval) => dispatch(scholarshipActions.updateScholarshipStart(documentId, userId, appType, grades, notes, approval)),
        [dispatch]
    );

    const updateNotes = (e) => {
        setNotes(e.target.value);
    }

    const handleDeleteScholarship = () => {
        setIsDeleting(true);
        removeScholarship(props.userId)
    }

    const onApprovalStatusChange = (status) => {
        setApprovalStatus(status);
    }

    const savePoints = (value, key) => {
        setGrades({
           ...grades,
           points: {
               ...grades.points,
               [key]: parseInt(value)
           }
        });
    }

    const saveQuestions = (value, key) => {
        // console.log("setGrades key: ", key);
        setGrades({
            ...grades,
            [key]: parseInt(value)
        });
    }

    const calculatePoints = (points) => {
        let total = 0;

        for(let point in points) {
            total += points[point];
        }

        return total;
    }

    const scholarshipEmailText = () => {
        if(approvalStatus === "approved") {
            if(props.scholarshipType === 'higherEdu') {
                // approved higherEdu
                return (
                    <>
                        <p>Dear {scholarshipAnswers.name},</p>
                        <p>Congratulations! You are the recipient of one of twenty-five (25) $1,000 Mid-Rivers Higher Education Scholarships for 2021! Applications were extremely competitive again this year, so you should be commended on your high-scoring submission.</p>
                        <p>A $1,000 check will be forwarded to the admissions office at the college or university you will be attending during the fall of 2021. This check will be applicable for academic expenses during the 2021-2022 academic school year.</p>
                        <p>Please accept your award by clicking the link below and completing the acceptance form.</p>
                        <p>{"{WOOFOO-LINK: https://midrivers.wufoo.com/forms/r13il1bq1920pii}"}    {"{LINK-TEXT: Application Acceptance Form}"}</p>
                        <p>If you have any questions, please call <a href='tel:6873336'>(406) 687-3336</a>. Mid-Rivers is hopeful that this scholarship will contribute to your future success.</p>
                        <p>{"<br>"}Sincerely,{"<br>"}Erin Lutts{"<br>"}Chief Communications Officer{"<br>"}erin.lutts@midrivers.coop</p>
                    </>
                )
            } else {
                // approved dcc
                return (
                    <>
                        <p>Dear {scholarshipAnswers.name},</p>
                        <p>Congratulations! You are the recipient of one of six (6) $1,500 Mid-Rivers Dawson Community College/Miles Community College Scholarships for 2021! Applications were extremely competitive again this year, so you should be commended on your high-scoring submission.</p>
                        <p>A $1,500 check will be forwarded to the admissions office at the college or university you will be attending during the fall of 2021. This check will be applicable for academic expenses during the 2021-2022 academic school year.</p>
                        <p>Please accept your award by clicking the link below and completing the acceptance form.</p>
                        <p>{"{WOOFOO-LINK: https://midrivers.wufoo.com/forms/r13il1bq1920pii}"}    {"%%LINK-TEXT: Application Acceptance Form"}</p>
                        <p>If you have any questions, please call <a href='tel:6873336'>(406) 687-3336</a>. Mid-Rivers is hopeful that this scholarship will contribute to your future success.</p>
                        <p>{"<br>"}Sincerely,{"<br>"}Erin Lutts{"<br>"}Chief Communications Officer{"<br>"}erin.lutts@midrivers.coop</p>
                    </>
                )
            }
        } else {
            // denied
            return (
                <>
                    <p>Dear {scholarshipAnswers.name},</p>
                    <p>Thank you for applying for one of the 2021 Mid-Rivers Competitive Scholarships. Unfortunately, you were not selected as one of this year's competitive scholarship recipients; however, we would like to encourage you to attend the Mid-Rivers Telephone Cooperative, Inc. Annual Meeting for an opportunity to try for another scholarship.</p>
                    <p>Mid-Rivers will award fourteen (14) $500 scholarships to area students through a drawing at the Cooperative's Annual Meeting. The meeting will be held on May 25, 2021, at the Custer County Event Center in Miles City, Montana. Registration will open at 10:00 AM and the Meeting will begin at 11:00 AM.</p>
                    <p>To qualify for the scholarship drawing, the student must:</p>
                    <p>
                        1) Attend the Annual Meeting with a parent or guardian who is a Cooperative Member with active local telephone or Internet service from Mid-Rivers.{"<br>"}
                        2) Sign up at the Scholarship Registration table at the Annual Meeting.{"<br>"}
                        3) Provide PROOF of full-time enrollment for the fall of 2021 at the Annual Meeting.{"<br>"}
                        4) Participate in simple interactive tasks that will be assigned at the Annual Meeting.{"<br>"}
                        5) Be present during the Business Meeting when the drawing takes place.
                    </p>
                    <p>The fourteen scholarship recipients will be drawn at random from the list of eligible students attending the meeting. Interested students may contact Mid-Rivers at <a href='tel:18004522288'>1-800-452-2288</a> for more information.</p>
                    <p>Sincerely,{"<br>"}Nicole Senner{"<br>"}Marketing & Branding Specialist{"<br>"}nicole.senner@midrivers.coop</p>
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
        const emailBody = scholarshipEmailText();
        createEditor(emailBody);
    };

    // closes the email preview box
    const cancelEmailPreview = () => {
        setShowPreview(null);
    };

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

        emailTextArray.forEach((line, idx) => {
            if(line.indexOf("{WOOFOO-LINK:") !== -1) {
                const woofooArray = line.split("}");
                const woofooLink = woofooArray[0].trim().substring(1).split("WOOFOO-LINK:").filter(function(el) { return el; });
                const woofooText = woofooArray[1].trim().substring(1).split("LINK-TEXT:").filter(function(el) { return el; });
                emailTextArray[idx] = `<a href="${woofooLink[0].trim()}">${woofooText[0].trim()}</a>`;
            }
        })

        sendApplicationEmail(scholarshipAnswers.email, emailTextArray, props.userId,
            scholarshipAnswers.name, props.scholarshipType, approvalStatus);
    };

    const toggleDeleteScholarship = () => {
        setEnableScholarshipDelete(!enableScholarshipDelete);
    };

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
            <ScholarshipStatusHeader>
                <PageHeader>
                    {sponsorshipName} for {scholarshipAnswers.name}
                </PageHeader>
                <h1 className="current-scholarship-status">Current Status: <span className={`status ${approvalStatus}`}>{approvalStatus}</span></h1>
            </ScholarshipStatusHeader>
            {showPreview &&
            <Row gutter={[16, 16]} style={{"width": "100%"}}>
                <div className={"editor-wrapper"}>
                    <Box style={{padding: 20, height: 'auto'}}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Email Preview</Title>
                        </ScholarshipSection>

                        {(props.emailError && !props.scholarshipFirebaseError) &&
                        <Alert
                            className={props.emailError ? "email-alert php-error show" : "email-alert php-error"}
                            message="Error"
                            description="There was an error sending the applicant email."
                            type="error"
                            showIcon
                        />
                        }

                        {props.scholarshipFirebaseError &&
                        <Alert
                            className={props.scholarshipFirebaseError ? "email-alert fb-error show" : "email-alert fb-error"}
                            message="Error"
                            description="There was an error updating the applicant data in firebase."
                            type="error"
                            showIcon
                        />
                        }

                        <EditorWrapper>
                            <ScholarshipSection>
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
                            </ScholarshipSection>

                            <ScholarshipSection>
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                    handleKeyCommand={handleKeyCommand}
                                    spellCheck={true}
                                    ref={editor}
                                />
                            </ScholarshipSection>
                        </EditorWrapper>

                        <ScholarshipSection>
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
                                                    disabled={props.scholarshipLoading}
                                            >Cancel</Button>

                                            <Button className={"btn send-email-to-email-applicant"}
                                                    loading={props.scholarshipLoading}
                                                    type="primary" size={"large"}
                                                    disabled={approvalStatus === 'pending'}
                                                    onClick={(e) => {
                                                        emailApplicant()
                                                    }}
                                            >{!props.emailSent ? "Send Email" : "Resend Email"}</Button>
                                        </Space>
                                    </div>
                                </div>
                            </EditorControls>
                        </ScholarshipSection>
                    </Box>
                </div>
            </Row>
            }

            <Row gutter={[16,16]} style={{"width": "100%"}}>
                <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Personal Info</Title>
                        </ScholarshipSection>

                        <ScholarshipSection>
                            <div className="info-wrapper">
                                <div className="profile-image-wrapper">
                                    <img src={profileImageUrl ? profileImageUrl : NoImage} alt={"profile image"}/>
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
                                    <Col className="gutter-row essay-column" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Where do you plan on attending school next semester:</h3>
                                        <p>{nextSchoolType}</p>
                                    </Col>
                                    <Col className="gutter-row essay-column" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Field of Study:</h3>
                                        <p>{scholarshipAnswers.fieldOfStudy}</p>
                                    </Col>
                                    <Col className="gutter-row essay-column" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Name of School:</h3>
                                        <p>{scholarshipAnswers.nextSchoolName}</p>
                                    </Col>
                                    <Col className="gutter-row essay-column" xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 12}}>
                                        <h3>Admissions Phone Number:</h3>
                                        <p>{scholarshipAnswers.nextSchoolPhone}</p>
                                    </Col>
                                    <Col className="gutter-row essay-column" xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 24}}>
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
                                            {profileImageUrl
                                                ? <a href={profileImageUrl} target="_blank">Profile Image</a>
                                                : <span className={"no-document"}><CloseOutlined />No Profile Image</span>
                                            }

                                        </p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        <p>
                                            {transcriptsUrl
                                                ? <a href={transcriptsUrl} target="_blank">Transcripts</a>
                                                : <span className={"no-document"}><CloseOutlined />No Transcripts</span>
                                            }

                                        </p>
                                    </Col>
                                    <Col className="gutter-row" xs={{span: 24}} sm={{span: 24}} md={{span: 8}} lg={{span: 8}}>
                                        {letterUrl
                                            ? <a href={letterUrl} target="_blank">Reference Letter</a>
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
                            <Title level={3} className={"application-section-title"}>Admin</Title>
                            <div className="delete-app-wrapper">
                                <div className="delete-confirm-box-wrapper">
                                    <Checkbox
                                        onChange={toggleDeleteScholarship}
                                        >
                                        Enable Delete
                                    </Checkbox>
                                </div>
                                <Button className={"btn preview-email-applicant"}
                                        type="default" size={"large"}
                                        disabled={!enableScholarshipDelete}
                                        loading={isDeleting}
                                        onClick={handleDeleteScholarship}
                                >Delete Application</Button>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Emails</Title>
                            {!applicantNotified ?
                                <Button className={"btn preview-email-applicant"}
                                        type="default" size={"large"}
                                        disabled={approvalStatus === 'pending'}
                                        onClick={previewEmail}
                                >Preview Email</Button>
                                :
                                <p className={"applicantNotified"}>This applicant has been notified and the application cannot be changed.</p>
                            }
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Grading</Title>
                            <Form {...formLayout}  name="grading-form" onFinish={onFormsFinish}>
                                <div className="general grade-block">
                                    <h3 className={"sub-title"}>General</h3>
                                    <div className="items" >
                                        <Form.Item label="Member">
                                            <Radio.Group disabled={applicantNotified} buttonStyle={"solid"} defaultValue={grades.isMember} onChange={(e) => {saveQuestions(e.target.value, "isMember")}}>
                                                <Radio.Button value={"yes"}>Yes</Radio.Button>
                                                <Radio.Button value={"no"}>No</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>

                                        <Form.Item label="Past Winner">
                                            <Radio.Group disabled={applicantNotified} buttonStyle={"solid"} defaultValue={grades.pastWinner} onChange={(e) => {saveQuestions(e.target.value, "pastWinner")}}>
                                                <Radio.Button value={"yes"}>Yes</Radio.Button>
                                                <Radio.Button value={"no"}>No</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="grades grade-block">
                                    <h3 className={"sub-title"}>Grades</h3>
                                    <div className="items">
                                        <Form.Item label="GPA">
                                            <Select disabled={applicantNotified} className={"gpa"} defaultValue={grades.points.gpa} key={"gpa"} onChange={(v) => {savePoints(v, "gpa")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                                <Select.Option value="4">4</Select.Option>
                                                <Select.Option value="5">5</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="ACT">
                                            <Select disabled={applicantNotified} className={"act"} defaultValue={grades.points.act} key={"act"} onChange={(v) => {savePoints(v, "act")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="Rank">
                                            <Select disabled={applicantNotified} className={"rank"} defaultValue={grades.points.rank} key={"rank"} onChange={(v) => {savePoints(v, "rank")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="activities-and-awards grade-block">
                                    <h3 className={"sub-title"}>Activities & Awards</h3>
                                    <div className="items">
                                        <Form.Item label="School Related">
                                            <Select disabled={applicantNotified} className={"school"} defaultValue={grades.points.schoolRelated} onChange={(v) => {savePoints(v, "schoolRelated")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="Community">
                                            <Select disabled={applicantNotified} className={"community"} defaultValue={grades.points.community} key={"community"} onChange={(v) => {savePoints(v, "community")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                                <Select.Option value="4">4</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="Awards & Honors">
                                            <Select disabled={applicantNotified} className={"awards"} defaultValue={grades.points.awards} key={"awards"} onChange={(v) => {savePoints(v, "awards")}}>
                                                <Select.Option value="0">0</Select.Option>
                                                <Select.Option value="1">1</Select.Option>
                                                <Select.Option value="2">2</Select.Option>
                                                <Select.Option value="3">3</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="work-history grade-block">
                                    <h3 className={"sub-title"}>Work History</h3>
                                    <div className="items">
                                        <Form.Item label="Employment">
                                            <Select disabled={applicantNotified} className={"employment"} defaultValue={grades.points.employment} key={"employment"} onChange={(v) => {savePoints(v, "employment")}}>
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
                                </div>

                                <div className="essays grade-block">
                                    <h3 className={"sub-title"}>Essays</h3>
                                    <div className="items">
                                        <Form.Item label="Content">
                                            <Select disabled={applicantNotified} className={"content"} defaultValue={grades.points.essays} key={"essays"} onChange={(v) => {savePoints(v, "essays")}}>
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
                                            <Select disabled={applicantNotified} className={"grammar"} defaultValue={grades.points.grammar} key={"grammar"}
                                                    onChange={(v) => {savePoints(v, "grammar")}}>
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

                                        <Form.Item label="Return to Area">
                                            <Select disabled={applicantNotified} className={"content"} key={"area"} defaultValue={grades.points.returnToArea}
                                                    onChange={(v) => {savePoints(v, "returnToArea")}}>
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
                                </div>
                            </Form>

                            <hr/>

                            <div className="points-total">
                                <h3>{calculatePoints(grades.points)} points</h3>
                            </div>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Notes</Title>
                            <Form layout="vertical" name="notes-form" onFinish={onFormsFinish}>
                                <Form.Item label="Notes">
                                    <TextArea rows={4}
                                              onKeyUp={(e) => {updateNotes(e)}}
                                              defaultValue={props.notes}
                                    />
                                </Form.Item>
                            </Form>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Approvals</Title>
                            <Form layout="vertical" name="approvals-form" onFinish={onFormsFinish}>
                                <Form.Item label="Approval Status">
                                    <Select disabled={applicantNotified} className="approval-select" key={"approval"} defaultValue={approvalStatus}
                                            onChange={(v) => onApprovalStatusChange(v)}>
                                        <Select.Option value={"approved"}>Approved</Select.Option>
                                        <Select.Option value={"denied"}>Denied</Select.Option>
                                        <Select.Option value={"pending"}>Pending</Select.Option>
                                        <Select.Option value={"eligible"}>Eligible</Select.Option>
                                        <Select.Option value={"ineligible"}>Ineligible</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </ScholarshipSection>
                    </Box>

                    <Box style={{ padding: 20, height: 'auto' }}>
                        <ScholarshipSection>
                            <Title level={3} className={"application-section-title"}>Saving</Title>
                            <Form layout="vertical" name="approvals-form" onFinish={onFormsFinish}>
                                <Form.Item label="">
                                    <Button
                                        className={"btn save-application-button"}
                                        type="primary"
                                        size={"large"}
                                        loading={props.adminIsSaving}
                                        onClick={(event) => {saveApplication(props.userId, props.scholarshipType, grades, notes, approvalStatus)}}
                                    >Save Application</Button>
                                </Form.Item>
                            </Form>
                        </ScholarshipSection>
                    </Box>
                </Col>
            </Row>

        </LayoutWrapper>
    )
}