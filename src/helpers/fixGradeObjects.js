import firebase from 'firebase/app';
import { db, auth } from '@iso/lib/firebase/firebase';
import {getCurrentYear} from "./shared";

const currentYear = getCurrentYear().toString();

const getScholarshipTestRef = (documentId) => {
    return db.collection("scholarshipsTestCollection").doc(currentYear).collection("applications").doc(documentId);
}

const getScholarshipRef = (documentId) => {
    return db.collection("scholarships").doc(currentYear).collection("applications").doc(documentId);
}

export const fixGradesObjects = (scholarships) => {
    console.group("fixScholarshipObjects")

    auth.onAuthStateChanged(function(user) {
        for (let scholarship of scholarships) {
            const grades = scholarship.admin.grades;

            const fixedGradesObj = {
                isMember: "no",
                pastWinner: "no",
                points: {
                    act: 0,
                    awards: 0,
                    community: 0,
                    employment: 0,
                    essays: 0,
                    gpa: 0,
                    grammar: 0,
                    rank: 0,
                    returnToArea: 0,
                    schoolRelated: 0
                }
            }

            if (!grades.hasOwnProperty("points")) {
                // change this to getScholarshipRef to use in production
                const ref = getScholarshipTestRef(scholarship.id);
                //console.log("app: ", scholarship);

                ref.update("admin.grades", fixedGradesObj)
                    .then(() => {
                        console.log("%s updated", scholarship.id)
                    })
                    .catch((error) => {
                        console.log("update error:", error);
                    });
            }
        }
    });

    console.groupEnd()
}