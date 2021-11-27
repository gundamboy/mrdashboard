import * as XLSX from 'xlsx';

export const GetSponsorships = (applicationsObj, status, appType) => {
    let pendingSponsorshipsHeaderRow = [
        "Submission Date", "Current Status", "Application Type", "Organization Name", "Primary Contact",
        "Primary Telephone", "Primary Email", "Application Link"
    ];

    let approvedMonetarySponsorshipsHeaderRow = [
        "Submission Date", "Current Status", "Application Type", "Organization Name", "Primary Contact",
        "Primary Telephone", "Primary Email", "Monetary Approved", "Admin Notes", "Applicant Emailed",
        "Application Link"
    ];

    let approvedMaterialSponsorshipsHeaderRow = [
        "Submission Date", "Current Status", "Application Type", "Organization Name", "Primary Contact",
        "Primary Telephone", "Primary Email", "Items Approved", "Admin Notes", "Applicant Emailed",
        "Application Link"
    ];

    let deniedSponsorshipsHeaderRow = [
        "Submission Date", "Current Status", "Application Type", "Organization Name", "Primary Contact",
        "Primary Telephone", "Primary Email", "Admin Notes", "Applicant Emailed",
        "Application Link"
    ];

    let sponsorshipsArray = [];

    // set the proper header row
    if (status === "pending") {
        sponsorshipsArray.push(pendingSponsorshipsHeaderRow);
    } else if (status === "denied") {
        sponsorshipsArray.push(deniedSponsorshipsHeaderRow);
    } else if (status === "approved" && appType === "Monetary") {
        sponsorshipsArray.push(approvedMonetarySponsorshipsHeaderRow);
    } else if (status === "approved" && appType === "Material") {
        sponsorshipsArray.push(approvedMaterialSponsorshipsHeaderRow);
    }

    // set the content arrays
    applicationsObj.forEach((app) => {
        console.log("app:", app);
        const submissionDate =  new Date(app.meta["submissionDate"].toDate()).toDateString();
        let itemsString = "";
        let itemsTextArray = [];
        const applicationLink = "http://dashboard.midrivers.com/dashboard/sponsorships/" + app.id;

        const existingItems = app.admin.itemsApproved;
        if (existingItems.length) {
            for (let idx in existingItems) {
                if(parseInt(idx) === existingItems.length - 1) {
                    itemsTextArray.push(" and " + existingItems[idx].itemQty + " " + existingItems[idx].itemName);
                } else {
                    itemsTextArray.push(existingItems[idx].itemQty + " " + existingItems[idx].itemName);
                }
            }

            itemsString = itemsTextArray.join(",");
        }

        if (status === "pending" && app.admin.approvalStatus === "pending") {
            sponsorshipsArray.push([
                submissionDate, app.admin.approvalStatus, app.submission.sponsorshipSelect, app.submission.orgName,
                app.submission.primaryName, app.submission.primaryPhone, app.submission.primaryEmail, applicationLink
            ]);
        } else if (status === "denied" && app.admin.approvalStatus === "denied") {
            sponsorshipsArray.push([
                submissionDate, "Denied", app.submission.sponsorshipSelect, app.submission.orgName,
                app.submission.primaryName, app.submission.primaryPhone, app.submission.primaryEmail, app.admin.notes,
                app.admin.notificationEmailed, applicationLink
            ]);
        } else if (status === "approved" && appType === "Monetary" && app.admin.approvalStatus === "approved" && app.submission.sponsorshipSelect === "Monetary") {
            sponsorshipsArray.push([
                submissionDate, "Approved", app.submission.sponsorshipSelect, app.submission.orgName,
                app.submission.primaryName, app.submission.primaryPhone, app.submission.primaryEmail,
                app.admin.amountApproved, app.admin.notes, app.admin.notificationEmailed, applicationLink
            ]);
        } else if (status === "approved" && appType === "Material" && app.admin.approvalStatus === "approved" && app.submission.sponsorshipSelect === "Material") {
            sponsorshipsArray.push([
                submissionDate, "Approved", app.submission.sponsorshipSelect, app.submission.orgName,
                app.submission.primaryName, app.submission.primaryPhone, app.submission.primaryEmail,
                itemsString, app.admin.notes, app.admin.notificationEmailed, applicationLink
            ]);
        }
    })

    return sponsorshipsArray;

};

export const ExportSponsorships = (applicationsObj) => {
    const noApps = ['No Applications in this category'];
    const pending = GetSponsorships(applicationsObj, "pending", null);
    const denied = GetSponsorships(applicationsObj, "denied", null);
    const approvedMonetary = GetSponsorships(applicationsObj, "approved", "Monetary");
    const approvedMaterial = GetSponsorships(applicationsObj, "approved", "Material");

    // show feedback instead of an empty sheet if no applications match
    if(pending.length <= 1) {pending.push(noApps)}
    if(denied.length <= 1) {denied.push(noApps)}
    if(approvedMonetary.length <= 1) {approvedMonetary.push(noApps)}
    if(approvedMaterial.length <= 1) {approvedMaterial.push(noApps)}

    // start the excel crap
    const wb = XLSX.utils.book_new();
    const pendingSheet = XLSX.utils.aoa_to_sheet(pending);
    const deniedSheet = XLSX.utils.aoa_to_sheet(denied);
    const approvedMonetarySheet = XLSX.utils.aoa_to_sheet(approvedMonetary);
    const approvedMaterialSheet = XLSX.utils.aoa_to_sheet(approvedMaterial);

    XLSX.utils.book_append_sheet(wb, pendingSheet, "Pending Applications");
    XLSX.utils.book_append_sheet(wb, deniedSheet, "Denied Applications");
    XLSX.utils.book_append_sheet(wb, approvedMonetarySheet, "Approved Monetary Applications");
    XLSX.utils.book_append_sheet(wb, approvedMaterialSheet, "Approved Material Applications");

    XLSX.writeFile(wb, "sponsorships-data.xlsx");

}