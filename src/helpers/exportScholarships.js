import * as XLSX from 'xlsx';
import * as firebase from "firebase";
import {formattedDate} from "./shared";

export const BuildWorkSheet = (scholarshipsData, status, appType) => {
    //console.group("BuildWorkSheet")
    // console.log("BuildWorkSheet scholarshipsData: ", scholarshipsData);
    // console.log("BuildWorkSheet status: ", status);
    // console.log("BuildWorkSheet appType: ", appType);
    let scholarshipsArray = [];

    let headerRow = [
        "Started Date", "Finished Date", "App Type", "Name", "Email", "Date of Birth",
        "Address", "City", "State", "Zip", "Phone", "Mid-Rivers Account Number", "Members Name", "Member Relation",
        "High School Name", "College", "High School GPA", "College GPA", "ACT Score", "Class Rank", "School Activities",
        "Community Activities", "Awards And Honors", "Next School Type", "Next School Name", "Next School Phone",
        "Next School Address", "Next School City", "Next School State", "Next School Zip", "Field Of Study",
        "Biography", "Career Goals", "Unsuccessful Experience", "Unique Skill", "Tech Changes", "Returning To Area",
        "Area Problem", "Work Experience 1", "Work Experience 2", "Work Experience 3", "Profile Image Link",
        "Transcripts Link", "Reference Letter Link", "Notified"];

    const approvedOrDeniedHeader = [
            ...headerRow, "Total Points", "Points - ACT", "Points - Awards", "Points - Community",
        "Points - Employment", "Points - Essays", "Points - GPA", "Points - Grammar", "Points - Is a Member",
        "Points - Past Winner", "Points - Class Rank", "Points - Return to Area", "Points - School Activities", "System Id"];

    headerRow = [...headerRow, "System Id"]

    if (scholarshipsData.applicationData.length) {
        //.log("app:", scholarshipsData);
        const applicationsArray = scholarshipsData.applicationData;

        for(let scholarshipInfo of applicationsArray) {
            const data = scholarshipInfo.currentScholarship;
            const scholarship = data[appType];
            const userId = data.id;
            const dates = data.dates[appType];
            let startedDate = dates.started !== "" ? formattedDate(new Date(dates.started.seconds*1000)) : "";
            let finishedDate = dates.finished !== "" ? formattedDate(new Date(dates.finished.seconds*1000)) : "";
            const admin = data.admin;
            const grades = admin.grades;
            const points = grades.points;
            const urls = data.urls[appType];

            if(status === "approved" || status === "denied") {
                if(finishedDate && !startedDate) {
                    startedDate = finishedDate;
                }
            }

            let profileImageUrl = "";
            let letterUrl = "";
            let transcriptsUrl = "";
            profileImageUrl = scholarship.profileImage ? scholarship.profileImage : urls.profileImageUrl;
            letterUrl = scholarship.referenceLetterUrl ? scholarship.referenceLetterUrl : urls.referenceLetterUrl;
            transcriptsUrl = scholarship.transcripts ? scholarship.transcripts : urls.transcriptsUrl;

            const workExperienceOne = buildWorkExperience(scholarship.employmentEmployerOne,
                scholarship.employmentTypeOne, scholarship.employmentPositionTitleOne,
                scholarship.employmentEmployedFromOne, scholarship.employmentEmployedToOne,
                scholarship.employmentWeeklyHoursOne, scholarship.employmentJobDescriptionOne);
            const workExperienceTwo = buildWorkExperience(scholarship.employmentEmployerTwo,
                scholarship.employmentTypeTwo, scholarship.employmentPositionTitleTwo,
                scholarship.employmentEmployedFromTwo, scholarship.employmentEmployedToTwo,
                scholarship.employmentWeeklyHoursTwo, scholarship.employmentJobDescriptionTwo);
            const workExperienceThree = buildWorkExperience(scholarship.employmentEmployerThree,
                scholarship.employmentTypeThree, scholarship.employmentPositionTitleThree,
                scholarship.employmentEmployedFromThree, scholarship.employmentEmployedToThree,
                scholarship.employmentWeeklyHoursThree, scholarship.employmentJobDescriptionThree);

            // default to dcc because why not
            let pendingSubmittedAnswers = [startedDate, finishedDate, appType, scholarship.name, scholarship.email,
                scholarship.dob, scholarship.address, scholarship.city, scholarship.state, scholarship.zip,
                scholarship.phone, scholarship.midRiversAccount, scholarship.membersName, scholarship.memberRelation,
                scholarship.highSchoolName, scholarship.college, scholarship.highSchoolGPA, scholarship.collegeGPA,
                scholarship.actScore, scholarship.classRank + " of " + scholarship.classTotal, scholarship.schoolActivities,
                scholarship.communityActivities, scholarship.awardsAndHonors, scholarship.nextSchoolType,
                scholarship.nextSchoolName, scholarship.nextSchoolPhone, scholarship.nextSchoolAddress,
                scholarship.nextSchoolCity, scholarship.nextSchoolState, scholarship.nextSchoolZip, scholarship.fieldOfStudy,
                scholarship.biography, scholarship.careerGoals, scholarship.unsuccessfulExperience, scholarship.uniqueSkill,
                scholarship.techChanges, scholarship.livingInMontana, scholarship.areaProblem, workExperienceOne,
                workExperienceTwo, workExperienceThree, profileImageUrl, transcriptsUrl,
                letterUrl, admin.applicantNotified[appType]];
            let approvedDeniedAnswers = [...pendingSubmittedAnswers, getTotalPoints(points), points.act, points.awards, points.community, points.employment, points.essays,
                points.gpa, points.grammar, grades.isMember, grades.pastWinner, points.rank, points.returnToArea,
                points.schoolRelated];

            pendingSubmittedAnswers = [...pendingSubmittedAnswers, userId];
            approvedDeniedAnswers = [...approvedDeniedAnswers, userId];

            // add the appropriate header row to the main array
            if (status === "pending" || status === "completed") {
                if (scholarshipsArray.length === 0) {
                    //console.log("pushing headerRow");
                    scholarshipsArray.push(headerRow);
                }
                scholarshipsArray.push(pendingSubmittedAnswers);
            } else if (status === "approved" || status === "denied") {
                if (scholarshipsArray.length === 0) {
                   // console.log("pushing approvedOrDeniedHeader");
                    scholarshipsArray.push(approvedOrDeniedHeader);
                }
                scholarshipsArray.push(approvedDeniedAnswers);
            }
        }
    } else {
        if(status === "pending" || status === "completed") {
            scholarshipsArray.push(headerRow);
        } else if (status === "approved" || status === "denied") {
            scholarshipsArray.push(approvedOrDeniedHeader);
        }
    }
    //console.groupEnd();

    return scholarshipsArray;
}

const buildWorkExperience = (employer = "N/A", jobType = "N/A", title = "N/A", from = "N/A", to = "N/A", hours = "N/A", description = "N/A") => {

    let employment = "Employer: " + employer + ",\n\r Employment Type: " +jobType +
        ", \n\rPosition Title: " + title + ", \n\rEmployment Dates: " + from + " - " + to +
        ", \n\rWeekly Hours: " +hours + ", \n\rJob Description: " + description;

    return employment;
}

const getTotalPoints = (points) => {
    let totalPoints = 0;
    for(let score in points) {
        totalPoints += points[score];
    }

    return totalPoints;
}

export const ExportScholarships = (pendingDccScholarshipsInfo, pendingEduScholarshipsInfo,
                                   completedDccScholarshipsInfo, completedEduScholarshipsInfo,
                                   approvedDccScholarshipsInfo, deniedDccScholarshipsInfo,
                                   approvedEduScholarshipsInfo, deniedEduScholarshipsInfo) => {

    // console.log("pendingDccScholarshipsInfo", pendingDccScholarshipsInfo);
    // console.log("pendingEduScholarshipsInfo", pendingEduScholarshipsInfo);
    // console.log("completedDccScholarshipsInfo", completedDccScholarshipsInfo);
    // console.log("completedEduScholarshipsInfo", completedEduScholarshipsInfo);
    // console.log("approvedScholarshipsInfo", approvedDccScholarshipsInfo);
    // console.log("deniedScholarshipsInfo", deniedDccScholarshipsInfo);
    // console.log("approvedScholarshipsInfo", approvedEduScholarshipsInfo);
    // console.log("deniedScholarshipsInfo", deniedEduScholarshipsInfo);
    // console.log("**********************************************************************");

    const noApps = ['No Applications in this category'];
    let pendingDcc = BuildWorkSheet(pendingDccScholarshipsInfo, "pending", "dcc");
    let pendingEdu = BuildWorkSheet(pendingEduScholarshipsInfo, "pending", "higherEdu");
    let completeDcc = BuildWorkSheet(completedDccScholarshipsInfo, "completed", "dcc");
    let completeEdu =  BuildWorkSheet(completedEduScholarshipsInfo, "completed", "higherEdu");
    let approvedDcc = BuildWorkSheet(approvedDccScholarshipsInfo, "approved", "dcc");
    let approvedEdu = BuildWorkSheet(approvedEduScholarshipsInfo, "approved", "higherEdu");
    let deniedDcc = BuildWorkSheet(deniedDccScholarshipsInfo, "denied", "dcc");
    let deniedEdu = BuildWorkSheet(deniedEduScholarshipsInfo, "denied", "higherEdu");

    if(pendingDcc.length <= 1) {pendingDcc.push(noApps);}
    if(pendingEdu.length <= 1) {pendingEdu.push(noApps);}
    if(completeDcc.length <= 1) {completeDcc.push(noApps);}
    if(completeEdu.length <= 1) {completeEdu.push(noApps);}
    if(approvedDcc.length <= 1) {approvedDcc.push(noApps);}
    if(approvedEdu.length <= 1) {approvedEdu.push(noApps);}
    if(deniedDcc.length <= 1) {deniedDcc.push(noApps);}
    if(deniedEdu.length <= 1) {deniedEdu.push(noApps);}

    const wb = XLSX.utils.book_new();
    const pendingDccSheet = XLSX.utils.aoa_to_sheet(pendingDcc);
    const pendingEduSheet = XLSX.utils.aoa_to_sheet(pendingEdu);
    const completeDccSheet = XLSX.utils.aoa_to_sheet(completeDcc);
    const completeEduSheet = XLSX.utils.aoa_to_sheet(completeEdu);
    const approvedDccSheet = XLSX.utils.aoa_to_sheet(approvedDcc);
    const approvedEduSheet = XLSX.utils.aoa_to_sheet(approvedEdu);
    const deniedDccSheet = XLSX.utils.aoa_to_sheet(deniedDcc);
    const deniedEduSheet = XLSX.utils.aoa_to_sheet(deniedEdu);

    XLSX.utils.book_append_sheet(wb, pendingDccSheet, "Pending DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, pendingEduSheet, "Pending EDU Scholarships");
    XLSX.utils.book_append_sheet(wb, completeDccSheet, "Completed DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, completeEduSheet, "Completed EDU Scholarships");
    XLSX.utils.book_append_sheet(wb, approvedDccSheet, "Approved DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, approvedEduSheet, "Approved EDU Scholarships");
    XLSX.utils.book_append_sheet(wb, deniedDccSheet, "Denied DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, deniedEduSheet, "Denied EDU Scholarships");

    XLSX.writeFile(wb, "sponsorships-data.xlsx");
}