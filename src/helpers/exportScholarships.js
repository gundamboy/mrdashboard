import * as XLSX from 'xlsx';
import {formattedDate} from "./shared";

export const BuildWorkSheet = (scholarshipsData, status, appType) => {
    console.group("BuildWorkSheet")
    console.log("BuildWorkSheet scholarshipsData: ", scholarshipsData);
    console.log("BuildWorkSheet status: ", status);
    console.log("BuildWorkSheet appType: ", appType);
    let scholarshipsArray = [];

    const headerRow = [
        "Started Date", "Finished Date", "App Type", "Name", "Email", "Date of Birth",
        "Address", "City", "State", "Zip", "Phone", "Mid-Rivers Account Number", "Members Name", "Member Relation",
        "High School Name", "College", "High School GPA", "College GPA", "ACT Score", "Class Rank", "School Activities",
        "Community Activities", "Awards And Honors", "Next School Type", "Next School Name", "Next School Phone",
        "Next School Address", "Next School City", "Next School State", "Next School Zip", "Field Of Study",
        "Biography", "Career Goals", "Unsuccessful Experience", "Unique Skill", "Tech Changes", "Returning To Area",
        "Area Problem", "Work Experience 1", "Work Experience 2", "Work Experience 3", "Profile Image Link",
        "Transcripts Link", "Reference Letter Link", "Notified", "System Id"];

    const approvedOrDeniedHeader = [
        "Started Date", "Finished Date", "App Type", "Name", "Email", "Date of Birth",
        "Address", "City", "State", "Zip", "Phone", "Mid-Rivers Account Number", "Members Name", "Member Relation",
        "High School Name", "College", "High School GPA", "College GPA", "ACT Score", "Class Rank", "School Activities",
        "Community Activities", "Awards And Honors", "Next School Type", "Next School Name", "Next School Phone",
        "Next000 School Address", "Next School City", "Next School State", "Next School Zip", "Field Of Study",
        "Biography", "Career Goals", "Unsuccessful Experience", "Unique Skill", "Tech Changes", "Returning To Area",
        "Work Experience 1", "Work Experience 2", "Work Experience 3", "Profile Image Link", "Transcripts Link",
        "Reference Letter Link", "Notified",
        "", "Total Points", "Points - ACT", "Points - Awards", "Points - Community", "Points - Employment",
        "Points - Essays", "Points - GPA", "Points - Grammar", "Points - Is a Member",
        "Points - Past Winner", "Points - Class Rank", "Points - Return to Area", "Points - School Activities",
        "System Id"];

    let eduHeadersVars = [
        "actScore","address","awardsAndHonors","biography","careerGoals","city","classRank","classTotal","college",
        "collegeGPA","communityActivities","dob","email","fieldOfStudy","highSchoolGPA","highSchoolName","letter",
        "livingInMontana","memberRelation","membersName","midRiversAccount","name","nextSchoolAddress","nextSchoolCity",
        "nextSchoolName","nextSchoolPhone","nextSchoolState","nextSchoolType","nextSchoolZip","phone","profileImage",
        "schoolActivities","state","techChanges","transcripts","uniqueSkill","unsuccessfulExperience","zip",
        "employmentEmployerOne","employmentTypeOne","employmentPositionTitleOne","employmentEmployedFromOne",
        "employmentEmployedToOne","employmentWeeklyHoursOne","employmentJobDescriptionOne","employmentEmployerTwo",
        "employmentTypeTwo","employmentPositionTitleTwo","employmentEmployedFromTwo","employmentEmployedToTwo",
        "employmentWeeklyHoursTwo","employmentJobDescriptionTwo","employmentEmployerThree","employmentTypeThree",
        "employmentPositionTitleThree","employmentEmployedFromThree","employmentEmployedToThree",
        "employmentWeeklyHoursThree", "employmentJobDescriptionThree"
    ]

    let dccHeaderVars = ["actScore", "address", "areaProblem", "awardsAndHonors", "biography", "careerGoals",
        "city", "classRank", "classTotal", "college", "collegeGPA", "communityActivities", "dob", "email",
        "fieldOfStudy", "highSchoolGPA", "highSchoolName", "referenceLetterUrl", "livingInMontana", "memberRelation",
        "membersName", "midRiversAccount", "name", "nextSchoolAddress", "nextSchoolCity", "nextSchoolName",
        "nextSchoolPhone", "nextSchoolState", "nextSchoolType", "nextSchoolZip", "phone", "profileImage",
        "schoolActivities", "state", "techChanges", "transcripts", "uniqueSkill", "unsuccessfulExperience",
        "zip", "employmentEmployerOne", "employmentTypeOne", "employmentPositionTitleOne", "employmentEmployedFromOne",
        "employmentEmployedToOne", "employmentWeeklyHoursOne", "employmentJobDescriptionOne", "employmentEmployerTwo",
        "employmentTypeTwo", "employmentPositionTitleTwo", "employmentEmployedFromTwo", "employmentEmployedToTwo",
        "employmentWeeklyHoursTwo", "employmentJobDescriptionTwo", "employmentEmployerThree", "employmentTypeThree",
        "employmentPositionTitleThree", "employmentEmployedFromThree", "employmentEmployedToThree",
        "employmentWeeklyHoursThree", "employmentJobDescriptionThree",];

    if(appType === "dcc") {

    }

    if(appType === "higherEdu") {

    }


    if (scholarshipsData.applicationData.length) {
        console.log("app:", scholarshipsData);
        const applicationsArray = scholarshipsData.applicationData;

        for(let scholarshipInfo of applicationsArray) {
            const data = scholarshipInfo.currentScholarship;
            const scholarship = data[appType];
            const userId = data.id;
            console.log("scholarship", scholarship);

            const dates = data.dates[appType];
            const startedDate = dates.started !== "" ? formattedDate(dates.started.toDate()) : "";
            const finishedDate = dates.finished !== "" ? formattedDate(dates.finished.toDate()) : "";
            const admin = data.admin;
            const grades = admin.grades;

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
                workExperienceTwo, workExperienceThree, scholarship.profileImage, scholarship.transcripts,
                scholarship.referenceLetterUrl, admin.applicantNotified[appType], userId];
            let approvedDeniedAnswers = [startedDate, finishedDate, appType, scholarship.name, scholarship.email,
                scholarship.dob, scholarship.address, scholarship.city, scholarship.state, scholarship.zip,
                scholarship.phone, scholarship.midRiversAccount, scholarship.membersName, scholarship.memberRelation,
                scholarship.highSchoolName, scholarship.college, scholarship.highSchoolGPA, scholarship.collegeGPA,
                scholarship.actScore, scholarship.classRank + " of " + scholarship.classTotal, scholarship.schoolActivities,
                scholarship.communityActivities, scholarship.awardsAndHonors, scholarship.nextSchoolType,
                scholarship.nextSchoolName, scholarship.nextSchoolPhone, scholarship.nextSchoolAddress,
                scholarship.nextSchoolCity, scholarship.nextSchoolState, scholarship.nextSchoolZip, scholarship.fieldOfStudy,
                scholarship.biography, scholarship.careerGoals, scholarship.unsuccessfulExperience, scholarship.uniqueSkill,
                scholarship.techChanges, scholarship.livingInMontana, scholarship.areaProblem, workExperienceOne,
                workExperienceTwo, workExperienceThree, scholarship.profileImage, scholarship.transcripts,
                scholarship.referenceLetterUrl, admin.applicantNotified[appType],
                "", grades.total, grades.act, grades.awards, grades.community, grades.employment, grades.essays,
                grades.gpa, grades.grammar, grades.isMember, grades.pastWinner, grades.rank, grades.returnToArea,
                grades.schoolRelated, userId];
            if (appType === "higherEdu") {
                pendingSubmittedAnswers = [startedDate, finishedDate, appType, scholarship.name, scholarship.email,
                    scholarship.dob, scholarship.address, scholarship.city, scholarship.state, scholarship.zip,
                    scholarship.phone, scholarship.midRiversAccount, scholarship.membersName, scholarship.memberRelation,
                    scholarship.highSchoolName, scholarship.college, scholarship.highSchoolGPA, scholarship.collegeGPA,
                    scholarship.actScore, scholarship.classRank + " of " + scholarship.classTotal,
                    scholarship.schoolActivities, scholarship.communityActivities, scholarship.awardsAndHonors,
                    scholarship.nextSchoolType, scholarship.nextSchoolName, scholarship.nextSchoolPhone,
                    scholarship.nextSchoolAddress, scholarship.nextSchoolCity, scholarship.nextSchoolState,
                    scholarship.nextSchoolZip, scholarship.fieldOfStudy, scholarship.biography, scholarship.careerGoals,
                    scholarship.unsuccessfulExperience, scholarship.uniqueSkill, scholarship.techChanges,
                    scholarship.livingInMontana, "N/A", workExperienceOne, workExperienceTwo, workExperienceThree,
                    scholarship.profileImage, scholarship.transcripts, scholarship.referenceLetterUrl,
                    admin.applicantNotified[appType], userId];
                approvedDeniedAnswers = [startedDate, finishedDate, appType, scholarship.name, scholarship.email,
                    scholarship.dob, scholarship.address, scholarship.city, scholarship.state, scholarship.zip,
                    scholarship.phone, scholarship.midRiversAccount, scholarship.membersName, scholarship.memberRelation,
                    scholarship.highSchoolName, scholarship.college, scholarship.highSchoolGPA, scholarship.collegeGPA,
                    scholarship.actScore, scholarship.classRank + " of " + scholarship.classTotal, scholarship.schoolActivities,
                    scholarship.communityActivities, scholarship.awardsAndHonors, scholarship.nextSchoolType,
                    scholarship.nextSchoolName, scholarship.nextSchoolPhone, scholarship.nextSchoolAddress,
                    scholarship.nextSchoolCity, scholarship.nextSchoolState, scholarship.nextSchoolZip, scholarship.fieldOfStudy,
                    scholarship.biography, scholarship.careerGoals, scholarship.unsuccessfulExperience, scholarship.uniqueSkill,
                    scholarship.techChanges, scholarship.livingInMontana, "N/A", workExperienceOne,
                    workExperienceTwo, workExperienceThree, scholarship.profileImage, scholarship.transcripts,
                    scholarship.referenceLetterUrl, admin.applicantNotified[appType],
                    "", grades.total, grades.act, grades.awards, grades.community, grades.employment, grades.essays,
                    grades.gpa, grades.grammar, grades.isMember, grades.pastWinner, grades.rank, grades.returnToArea,
                    grades.schoolRelated, userId];
            }
            // add the appropriate header row to the main array
            if (status === "pending" || status === "completed") {
                if (scholarshipsArray.length === 0) {
                    console.log("pushing headerRow");
                    scholarshipsArray.push(headerRow);
                }
                scholarshipsArray.push(pendingSubmittedAnswers);
            } else if (status === "approved" || status === "denied") {
                if (scholarshipsArray.length === 0) {
                    console.log("pushing approvedOrDeniedHeader");
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
    console.groupEnd();

    return scholarshipsArray;
}

const buildWorkExperience = (employer = "N/A", jobType = "N/A", title = "N/A", from = "N/A", to = "N/A", hours = "N/A", description = "N/A") => {

    let employment = "Employer: " + employer + ",\n\r Employment Type: " +jobType +
        ", \n\rPosition Title: " + title + ", \n\rEmployment Dates: " + from + " - " + to +
        ", \n\rWeekly Hours: " +hours + ", \n\rJob Description: " + description;

    return employment;
}

export const ExportScholarships = (pendingDccScholarshipsInfo, pendingEduScholarshipsInfo,
                                   completedDccScholarshipsInfo, completedEduScholarshipsInfo,
                                   approvedScholarshipsInfo, deniedScholarshipsInfo) => {

    const noApps = ['No Applications in this category'];
    let pendingDcc = BuildWorkSheet(pendingDccScholarshipsInfo, "pending", "dcc");
    let pendingEdu = BuildWorkSheet(pendingEduScholarshipsInfo, "pending", "higherEdu");
    let completeDcc = BuildWorkSheet(completedDccScholarshipsInfo, "completed", "dcc");
    let completeEdu =  BuildWorkSheet(completedEduScholarshipsInfo, "completed", "higherEdu");
    let approved = BuildWorkSheet(approvedScholarshipsInfo, "approved", null);
    let denied = BuildWorkSheet(deniedScholarshipsInfo, "denied", null);

    if(pendingDcc.length <= 1) {pendingDcc.push(noApps);}
    if(pendingEdu.length <= 1) {pendingEdu.push(noApps);}
    if(completeDcc.length <= 1) {completeDcc.push(noApps);}
    if(completeEdu.length <= 1) {completeEdu.push(noApps);}
    if(approved.length <= 1) {approved.push(noApps);}
    if(denied.length <= 1) {denied.push(noApps);}

    const wb = XLSX.utils.book_new();
    const pendingDccSheet = XLSX.utils.aoa_to_sheet(pendingDcc);
    const pendingEduSheet = XLSX.utils.aoa_to_sheet(pendingEdu);
    const completeDccSheet = XLSX.utils.aoa_to_sheet(completeDcc);
    const completeEduSheet = XLSX.utils.aoa_to_sheet(completeEdu);
    const approvedSheet = XLSX.utils.aoa_to_sheet(approved);
    const deniedSheet = XLSX.utils.aoa_to_sheet(denied);

    XLSX.utils.book_append_sheet(wb, pendingDccSheet, "Pending DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, pendingEduSheet, "Pending EDU Scholarships");
    XLSX.utils.book_append_sheet(wb, completeDccSheet, "Completed DCC Scholarships");
    XLSX.utils.book_append_sheet(wb, completeEduSheet, "Completed EDU Scholarships");
    XLSX.utils.book_append_sheet(wb, approvedSheet, "Approved Scholarships");
    XLSX.utils.book_append_sheet(wb, deniedSheet, "Denied Scholarships");

    XLSX.writeFile(wb, "sponsorships-data.xlsx");
}