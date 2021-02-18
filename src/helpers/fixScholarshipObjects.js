import firebase from 'firebase/app';
import { db, auth } from '@iso/lib/firebase/firebase';

export const fixScholarshipObjects = (allScholarships) => {
    console.group("fixScholarshipObjects")
    console.log("fixScholarshipObjects allScholarships: ", allScholarships);

    if (allScholarships.length) {
        //console.log("app:", allScholarships);
        const scholarshipsArray = allScholarships;

        auth.onAuthStateChanged(function(user) {
            if(user) {
                for(let scholarship of scholarshipsArray) {
                    //console.log("scholarship", scholarship);

                    const dccScholarship = scholarship["dcc"];
                    const eduScholarship = scholarship["higherEdu"];
                    const admin = scholarship["admin"];
                    const progress = scholarship["progress"];
                    const submissions = scholarship["submissions"];
                    const urls = scholarship["urls"];
                    const dates = scholarship["dates"];
                    const userId = scholarship.id;
                    const keyRef = db.collection('scholarships').doc("2021").collection("applications").doc(userId);

                    let fixedDccEmploymentTypeOne = dccScholarship.hasOwnProperty("employmentTypeOne") ? dccScholarship.employmentTypeOne : "";
                    let fixedDccEmploymentTypeTwo = dccScholarship.hasOwnProperty("employmentTypeTwo") ? dccScholarship.employmentTypeTwo : "";
                    let fixedDccEmploymentTypeThree = dccScholarship.hasOwnProperty("employmentTypeThree") ? dccScholarship.employmentTypeThree : "";
                    let fixedEduEmploymentTypeOne = eduScholarship.hasOwnProperty("employmentTypeOne") ? eduScholarship.employmentTypeOne : "";
                    let fixedEduEmploymentTypeTwo = eduScholarship.hasOwnProperty("employmentTypeTwo") ? eduScholarship.employmentTypeTwo : "";
                    let fixedEduEmploymentTypeThree = eduScholarship.hasOwnProperty("employmentTypeThree") ? eduScholarship.employmentTypeThree : "";
                    const hours = getEmploymentHours(userId);

                    if (!dccScholarship.employmentTypeOne) {
                        fixedDccEmploymentTypeOne = dccScholarship.hasOwnProperty("employmentEmploymentTypeOne") ? dccScholarship.employmentEmploymentTypeOne : "";
                    }

                    if (!dccScholarship.employmentTypeTwo) {
                        fixedDccEmploymentTypeTwo = dccScholarship.hasOwnProperty("employmentEmploymentTypeTwo") ? dccScholarship.employmentEmploymentTypeTwo : "";
                    }

                    if (!dccScholarship.employmentTypeThree) {
                        fixedDccEmploymentTypeThree = dccScholarship.hasOwnProperty("employmentEmploymentTypeThree") ? dccScholarship.EmeloymentTyEmploymentpeThree : "";
                    }

                    if (!eduScholarship.employmentTypeOne) {
                        fixedEduEmploymentTypeOne = eduScholarship.hasOwnProperty("employmentEmploymentTypeOne") ? eduScholarship.employmentEmploymentTypeOne : "";
                    }

                    if (!eduScholarship.employmentTypeTwo) {
                        fixedEduEmploymentTypeTwo = eduScholarship.hasOwnProperty("employmentEmploymentTypeTwo") ? eduScholarship.employmentEmploymentTypeTwo : "";
                    }

                    if (!eduScholarship.employmentTypeThree) {
                        fixedEduEmploymentTypeThree = eduScholarship.hasOwnProperty("employmentEmploymentTypeThree") ? eduScholarship.EmeloymentTyEmploymentpeThree : "";
                    }

                    let dccApp = {
                        actScore: dccScholarship.actScore ? dccScholarship.actScore : "",
                        address: dccScholarship.address ? dccScholarship.address : "",
                        areaProblem: dccScholarship.areaProblem ? dccScholarship.areaProblem : "",
                        awardsAndHonors: dccScholarship.awardsAndHonors ? dccScholarship.awardsAndHonors : "",
                        biography: dccScholarship.biography ? dccScholarship.biography : "",
                        careerGoals: dccScholarship.careerGoals ? dccScholarship.careerGoals : "",
                        city: dccScholarship.city ? dccScholarship.city : "",
                        classRank: dccScholarship.classRank ? dccScholarship.classRank : "",
                        classTotal: dccScholarship.classTotal ? dccScholarship.classTotal : "",
                        college: dccScholarship.college ? dccScholarship.college : "",
                        collegeGPA: dccScholarship.collegeGPA ? dccScholarship.collegeGPA : "",
                        communityActivities: dccScholarship.communityActivities ? dccScholarship.communityActivities : "",
                        dob: dccScholarship.dob ? dccScholarship.dob : "",
                        email: dccScholarship.email ? dccScholarship.email : "",
                        fieldOfStudy: dccScholarship.fieldOfStudy ? dccScholarship.fieldOfStudy : "",
                        highSchoolGPA: dccScholarship.highSchoolGPA ? dccScholarship.highSchoolGPA : "",
                        highSchoolName: dccScholarship.highSchoolName ? dccScholarship.highSchoolName : "",
                        letter: dccScholarship.referenceLetterUrl ? dccScholarship.referenceLetterUrl : "",
                        livingInMontana: dccScholarship.livingInMontana ? dccScholarship.livingInMontana : "",
                        memberRelation: dccScholarship.memberRelation ? dccScholarship.memberRelation : "",
                        membersName: dccScholarship.membersName ? dccScholarship.membersName : "",
                        midRiversAccount: dccScholarship.midRiversAccount ? dccScholarship.midRiversAccount : "",
                        name: dccScholarship.name ? dccScholarship.name : "",
                        nextSchoolAddress: dccScholarship.nextSchoolAddress ? dccScholarship.nextSchoolAddress : "",
                        nextSchoolCity: dccScholarship.nextSchoolCity ? dccScholarship.nextSchoolCity : "",
                        nextSchoolName: dccScholarship.nextSchoolName ? dccScholarship.nextSchoolName : "",
                        nextSchoolPhone: dccScholarship.nextSchoolPhone ? dccScholarship.nextSchoolPhone : "",
                        nextSchoolState: dccScholarship.nextSchoolState ? dccScholarship.nextSchoolState : "",
                        nextSchoolType: dccScholarship.nextSchoolType ? dccScholarship.nextSchoolType : "",
                        nextSchoolZip: dccScholarship.nextSchoolZip ? dccScholarship.nextSchoolZip : "",
                        phone: dccScholarship.phone ? dccScholarship.phone : "",
                        profileImage: dccScholarship.profileImage ? dccScholarship.profileImage : "",
                        schoolActivities: dccScholarship.schoolActivities ? dccScholarship.schoolActivities : "",
                        state: dccScholarship.state ? dccScholarship.state : "",
                        techChanges: dccScholarship.techChanges ? dccScholarship.techChanges : "",
                        transcripts: dccScholarship.transcripts ? dccScholarship.transcripts : "",
                        uniqueSkill: dccScholarship.uniqueSkill ? dccScholarship.uniqueSkill : "",
                        unsuccessfulExperience: dccScholarship.unsuccessfulExperience ? dccScholarship.unsuccessfulExperience : "",
                        zip: dccScholarship.zip ? dccScholarship.zip : "",
                        employmentEmployerOne: dccScholarship.employmentEmployerOne ? dccScholarship.employmentEmployerOne : "",
                        employmentTypeOne: fixedDccEmploymentTypeOne ? fixedDccEmploymentTypeOne : "",
                        employmentPositionTitleOne: dccScholarship.employmentPositionTitleOne ? dccScholarship.employmentPositionTitleOne : "",
                        employmentEmployedFromOne: dccScholarship.employmentEmployedFromOne ? dccScholarship.employmentEmployedFromOne : "",
                        employmentEmployedToOne: dccScholarship.employmentEmployedToOne ? dccScholarship.employmentEmployedToOne : "",
                        employmentWeeklyHoursOne: hours.dccHoursOne ? hours.dccHoursOne : "",
                        employmentJobDescriptionOne: dccScholarship.employmentJobDescriptionOne ? dccScholarship.employmentJobDescriptionOne : "",
                        employmentEmployerTwo: dccScholarship.employmentEmployerTwo ? dccScholarship.employmentEmployerTwo : "",
                        employmentTypeTwo: fixedDccEmploymentTypeTwo ? fixedDccEmploymentTypeTwo : "",
                        employmentPositionTitleTwo: dccScholarship.employmentPositionTitleTwo ? dccScholarship.employmentPositionTitleTwo : "",
                        employmentEmployedFromTwo: dccScholarship.employmentEmployedFromTwo ? dccScholarship.employmentEmployedFromTwo : "",
                        employmentEmployedToTwo: dccScholarship.employmentEmployedToTwo ? dccScholarship.employmentEmployedToTwo : "",
                        employmentWeeklyHoursTwo: hours.dccHoursTwo ? hours.dccHoursTwo : "",
                        employmentJobDescriptionTwo: dccScholarship.employmentJobDescriptionTwo ? dccScholarship.employmentJobDescriptionTwo : "",
                        employmentEmployerThree: dccScholarship.employmentEmployerThree ? dccScholarship.employmentEmployerThree : "",
                        employmentTypeThree: fixedDccEmploymentTypeThree ? fixedDccEmploymentTypeThree : "",
                        employmentPositionTitleThree: dccScholarship.employmentPositionTitleThree ? dccScholarship.employmentPositionTitleThree : "",
                        employmentEmployedFromThree: dccScholarship.employmentEmployedFromThree ? dccScholarship.employmentEmployedFromThree : "",
                        employmentEmployedToThree: dccScholarship.employmentEmployedToThree ? dccScholarship.employmentEmployedToThree : "",
                        employmentWeeklyHoursThree: hours.dccHoursThree ? hours.dccHoursThree : "",
                        employmentJobDescriptionThree: dccScholarship.employmentJobDescriptionThree ? dccScholarship.employmentJobDescriptionThree : ""
                    }

                    let eduApp = {
                        actScore: eduScholarship.actScore ? eduScholarship.actScore : "",
                        address: eduScholarship.address ? eduScholarship.address : "",
                        awardsAndHonors: eduScholarship.awardsAndHonors ? eduScholarship.awardsAndHonors : "",
                        biography: eduScholarship.biography ? eduScholarship.biography : "",
                        careerGoals: eduScholarship.careerGoals ? eduScholarship.careerGoals : "",
                        city: eduScholarship.city ? eduScholarship.city : "",
                        classRank: eduScholarship.classRank ? eduScholarship.classRank : "",
                        classTotal: eduScholarship.classTotal ? eduScholarship.classTotal : "",
                        college: eduScholarship.college ? eduScholarship.college : "",
                        collegeGPA: eduScholarship.collegeGPA ? eduScholarship.collegeGPA : "",
                        communityActivities: eduScholarship.communityActivities ? eduScholarship.communityActivities : "",
                        dob: eduScholarship.dob ? eduScholarship.dob : "",
                        email: eduScholarship.email ? eduScholarship.email : "",
                        fieldOfStudy: eduScholarship.fieldOfStudy ? eduScholarship.fieldOfStudy : "",
                        highSchoolGPA: eduScholarship.highSchoolGPA ? eduScholarship.highSchoolGPA : "",
                        highSchoolName: eduScholarship.highSchoolName ? eduScholarship.highSchoolName : "",
                        letter: eduScholarship.referenceLetterUrl ? eduScholarship.referenceLetterUrl : "",
                        livingInMontana: eduScholarship.livingInMontana ? eduScholarship.livingInMontana : "",
                        memberRelation: eduScholarship.memberRelation ? eduScholarship.memberRelation : "",
                        membersName: eduScholarship.membersName ? eduScholarship.membersName : "",
                        midRiversAccount: eduScholarship.midRiversAccount ? eduScholarship.midRiversAccount : "",
                        name: eduScholarship.name ? eduScholarship.name : "",
                        nextSchoolAddress: eduScholarship.nextSchoolAddress ? eduScholarship.nextSchoolAddress : "",
                        nextSchoolCity: eduScholarship.nextSchoolCity ? eduScholarship.nextSchoolCity : "",
                        nextSchoolName: eduScholarship.nextSchoolName ? eduScholarship.nextSchoolName : "",
                        nextSchoolPhone: eduScholarship.nextSchoolPhone ? eduScholarship.nextSchoolPhone : "",
                        nextSchoolState: eduScholarship.nextSchoolState ? eduScholarship.nextSchoolState : "",
                        nextSchoolType: eduScholarship.nextSchoolType ? eduScholarship.nextSchoolType : "",
                        nextSchoolZip: eduScholarship.nextSchoolZip ? eduScholarship.nextSchoolZip : "",
                        phone: eduScholarship.phone ? eduScholarship.phone : "",
                        profileImage: eduScholarship.profileImage ? eduScholarship.profileImage : "",
                        schoolActivities: eduScholarship.schoolActivities ? eduScholarship.schoolActivities : "",
                        state: eduScholarship.state ? eduScholarship.state : "",
                        techChanges: eduScholarship.techChanges ? eduScholarship.techChanges : "",
                        transcripts: eduScholarship.transcripts ? eduScholarship.transcripts : "",
                        uniqueSkill: eduScholarship.uniqueSkill ? eduScholarship.uniqueSkill : "",
                        unsuccessfulExperience: eduScholarship.unsuccessfulExperience ? eduScholarship.unsuccessfulExperience : "",
                        zip: eduScholarship.zip ? eduScholarship.zip : "",
                        employmentEmployerOne: eduScholarship.employmentEmployerOne ? eduScholarship.employmentEmployerOne : "",
                        employmentTypeOne: fixedEduEmploymentTypeOne ? fixedEduEmploymentTypeOne : "",
                        employmentPositionTitleOne: eduScholarship.employmentPositionTitleOne ? eduScholarship.employmentPositionTitleOne : "",
                        employmentEmployedFromOne: eduScholarship.employmentEmployedFromOne ? eduScholarship.employmentEmployedFromOne : "",
                        employmentEmployedToOne: eduScholarship.employmentEmployedToOne ? eduScholarship.employmentEmployedToOne : "",
                        employmentWeeklyHoursOne: hours.eduHoursOne ? hours.eduHoursOne : "",
                        employmentJobDescriptionOne: eduScholarship.employmentJobDescriptionOne ? eduScholarship.employmentJobDescriptionOne : "",
                        employmentEmployerTwo: eduScholarship.employmentEmployerTwo ? eduScholarship.employmentEmployerTwo : "",
                        employmentTypeTwo: fixedEduEmploymentTypeTwo ? fixedEduEmploymentTypeTwo : "",
                        employmentPositionTitleTwo: eduScholarship.employmentPositionTitleTwo ? eduScholarship.employmentPositionTitleTwo : "",
                        employmentEmployedFromTwo: eduScholarship.employmentEmployedFromTwo ? eduScholarship.employmentEmployedFromTwo : "",
                        employmentEmployedToTwo: eduScholarship.employmentEmployedToTwo ? eduScholarship.employmentEmployedToTwo : "",
                        employmentWeeklyHoursTwo: hours.eduHoursTwo ? hours.eduHoursTwo : "",
                        employmentJobDescriptionTwo: eduScholarship.employmentJobDescriptionTwo ? eduScholarship.employmentJobDescriptionTwo : "",
                        employmentEmployerThree: eduScholarship.employmentEmployerThree ? eduScholarship.employmentEmployerThree : "",
                        employmentTypeThree: fixedEduEmploymentTypeThree ? fixedEduEmploymentTypeThree : "",
                        employmentPositionTitleThree: eduScholarship.employmentPositionTitleThree ? eduScholarship.employmentPositionTitleThree : "",
                        employmentEmployedFromThree: eduScholarship.employmentEmployedFromThree ? eduScholarship.employmentEmployedFromThree : "",
                        employmentEmployedToThree: eduScholarship.employmentEmployedToThree ? eduScholarship.employmentEmployedToThree : "",
                        employmentWeeklyHoursThree: hours.eduHoursThree ? hours.eduHoursThree : "",
                        employmentJobDescriptionThree: eduScholarship.employmentJobDescriptionThree ? eduScholarship.employmentJobDescriptionThree : ""

                    }

                    let doc = {
                        admin: admin,
                        dates: dates,
                        dcc: dccApp,
                        higherEdu: eduApp,
                        progress: progress,
                        submissions: submissions,
                        urls: urls
                    }

                    //batch.set(keyRef, doc);
                    //batch.update(keyRef, eduApp);

                    keyRef.update({
                        dcc: firebase.firestore.FieldValue.delete(),
                        higherEdu: firebase.firestore.FieldValue.delete()
                    }).then(() => {
                        console.log("deleted");
                    })

                    keyRef.update({
                        dcc: dccApp,
                        higherEdu: eduApp
                    }).then(() => {
                        console.log("updated");
                    })
                }

                // batch.commit()
                //     .then(() => {
                //         console.log("batch job done");
                //     })
                //     .catch((error) => {
                //         console.group("Firebase Upload Error");
                //         console.log("code: ", error.code);
                //         console.log("message: ", error.message);
                //         console.groupEnd();
                //     })
            }
        });
    }
    console.groupEnd();

}

export const getEmploymentHours = (userId) => {
    let dccHoursOne = "";
    let dccHoursTwo = "";
    let dccHoursThree = "";
    let eduHoursOne = "";
    let eduHoursTwo = "";
    let eduHoursThree = "";

    if(userId === "uL5IO2F0JmVaV9H0sCCKBeNCOX62") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "SmokcynghvbDqk1ApxuwFm330DD2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "qsMPIYDixrWRoLPKho3FyHQZ7l22") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "40 hours";
        eduHoursTwo = "40 hours";
        eduHoursThree = "";
    }

    if(userId === "3MHiYZAvsnYctiWt6FRnVzH18ef2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "fOdcCVdXwvadX1gIBhrKtcuu5W93") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "s8SB7u5dlpXFNykR2K2cFmj26U43") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "DR3XleebF5e9qeh66BNQ8Paxnus2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "40";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "QgNUReHA39OR1F3wGaeKOLNfxdH3") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "73";
        eduHoursTwo = "80";
        eduHoursThree = "";
    }

    if(userId === "OiyqEbGXdES0ZeGC0zZzsHGA3F73") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "15-20";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "bzkOUuq3nUUTgo9P0py9fuBo2bk1") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "20 hours per week";
        eduHoursTwo = "5 hrs per week";
        eduHoursThree = "";
    }

    if(userId === "sZS3jGqIWZNrUOBqdb0NmPoR8Pi2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "20";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "pjRFQ3ggYPY0aSPtrg34HNNiowo2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "vf5jW3i002P9dmVOnd09WZLpns42") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "6";
        eduHoursTwo = "40";
        eduHoursThree = "20";
    }

    if(userId === "HDacUyPrwRXer9zrBfTu6KXd4lJ3") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "40";
        eduHoursTwo = "20";
        eduHoursThree = "";
    }

    if(userId === "Q0KiuojHmCTtmAAmpzqDsJ9RrxX2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "OiyqEbGXdES0ZeGC0zZzsHGA3F73") {
        dccHoursOne = "15-20";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "QrDZoiskvkWoFFN6Or8UzkThjtJ3") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "40- 60";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    if(userId === "hQPL2dIDsQa1S4GTpuDbuVCHcNt2") {
        dccHoursOne = "";
        dccHoursTwo = "";
        dccHoursThree = "";
        eduHoursOne = "35-40";
        eduHoursTwo = "35-40";
        eduHoursThree = "";
    }

    if(userId === "VVdfSrm0zhbneCVADXNw9z9tpKJ3") {
        dccHoursOne = "40";
        dccHoursTwo = "10";
        dccHoursThree = "";
        eduHoursOne = "";
        eduHoursTwo = "";
        eduHoursThree = "";
    }

    return {
        dccHoursOne: dccHoursOne,
        dccHoursTwo: dccHoursTwo,
        dccHoursThree: dccHoursThree,
        eduHoursOne: eduHoursOne,
        eduHoursTwo: eduHoursTwo,
        eduHoursThree: eduHoursThree
    }

}