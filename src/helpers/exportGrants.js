import * as XLSX from 'xlsx';
import {formattedDate} from "./shared";

export const GetGrants =(applicationsObj, status) => {
    let pendingHeaderRow = [
        "Submission Date", "Amount Requested", "Applicant Name", "Organization", "Address", "City", "State", "Zip",
        "Telephone", "Video Link"
    ];

    let approvedHeaderRow = [
        "Submission Date", "Approval Date", "Amount Approved", "Applicant Name", "Organization", "Address", "City", "State", "Zip",
        "Telephone", "Video Link", "Admin Notes"
    ];

    let deniedHeaderRow = [
        "Submission Date", "Denial Date", "Amount Requested", "Applicant Name", "Organization", "Address", "City", "State", "Zip",
        "Telephone", "Video Link", "Admin Notes"
    ];

    let grantsArray = [];

    // set the proper header row
    if (status === "pending") {
        grantsArray.push(pendingHeaderRow);
    } else if (status === "denied") {
        grantsArray.push(deniedHeaderRow);
    } else if (status === "approved") {
        grantsArray.push(approvedHeaderRow);
    }

    applicationsObj.forEach((app) => {
        const submissionDate = formattedDate(new Date(app.submitted.toDate()));
        const address = app.organizationAddressLineTwo.length ? app.organizationAddress + " " + app.organizationAddressLineTwo : app.organizationAddress;

        if (app.grantsStatus === "pending" && status === "pending") {
            grantsArray.push([
                submissionDate, app.amountRequested, app.name, app.organizationName, address, app.city, app.state,
                app.zipcode, app.phone, app.videoLink
            ]);
        } else if (app.grantsStatus === "approved" && status === "approved") {
            const approvalDate = app.decisionDate ? formattedDate(new Date(app.decisionDate.toDate())) : "";
            grantsArray.push([
                submissionDate, approvalDate, app.amountAwarded, app.name, app.organizationName, address, app.city,
                app.state, app.zipcode, app.phone, app.videoLink, app.notes
            ]);
        } else if (app.grantsStatus === "denied" && status === "denied") {
            const deniedDate = app.decisionDate ? formattedDate(new Date(app.decisionDate.toDate())) : "";
            grantsArray.push([
                submissionDate, deniedDate, app.amountRequested, app.name, app.organizationName, address, app.city,
                app.state, app.zipcode, app.phone, app.videoLink, app.notes
            ]);
        }
    })

    return grantsArray;
}

export const ExportGrants = (applicationsObj) => {
    console.log("applicationsObj:", applicationsObj);

    const noApps = ['No Applications in this category'];
    const pending = GetGrants(applicationsObj, "pending");
    const approved = GetGrants(applicationsObj, "approved");
    const denied = GetGrants(applicationsObj, "denied");

    // show feedback instead of an empty sheet if no applications match
    if(pending.length <= 1) {pending.push(noApps)}
    if(denied.length <= 1) {denied.push(noApps)}
    if(approved.length <= 1) {approved.push(noApps)}

    // start the excel crap
    const wb = XLSX.utils.book_new();
    const pendingSheet = XLSX.utils.aoa_to_sheet(pending);
    const deniedSheet = XLSX.utils.aoa_to_sheet(denied);
    const approvedSheet = XLSX.utils.aoa_to_sheet(approved);

    XLSX.utils.book_append_sheet(wb, pendingSheet, "Pending Applications");
    XLSX.utils.book_append_sheet(wb, deniedSheet, "Denied Applications");
    XLSX.utils.book_append_sheet(wb, approvedSheet, "Approved Applications");

    XLSX.writeFile(wb, "grants-data.xlsx");
}