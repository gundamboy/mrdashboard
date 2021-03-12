const actions = {
    ACTIVE_TAB: 'ACTIVE_TAB',
    ACTIVE_SCHOLARSHIPS_TAB: 'ACTIVE_SCHOLARSHIPS_TAB',

    FETCH_SCHOLARSHIPS_START: 'FETCH_SCHOLARSHIPS_START',
    FETCH_SCHOLARSHIPS_SUCCESS: 'FETCH_SCHOLARSHIPS_SUCCESS',
    FETCH_SCHOLARSHIPS_FAILURE: 'FETCH_SCHOLARSHIPS_FAILURE',

    FETCH_SINGLE_SCHOLARSHIP_START: 'FETCH_SINGLE_SCHOLARSHIP_START',
    FETCH_SINGLE_SCHOLARSHIP: 'FETCH_SINGLE_SCHOLARSHIP',
    FETCH_SINGLE_SCHOLARSHIP_SUCCESS: 'FETCH_SINGLE_SCHOLARSHIP_SUCCESS',
    FETCH_SINGLE_SCHOLARSHIP_FAILURE: 'FETCH_SINGLE_SCHOLARSHIP_FAILURE',

    UPDATE_SCHOLARSHIP: "UPDATE_SCHOLARSHIP",
    UPDATE_SCHOLARSHIP_SUCCESS: "UPDATE_SCHOLARSHIP_SUCCESS",

    UPDATE_SCHOLARSHIP_GRADES: "UPDATE_SCHOLARSHIP_GRADES",
    UPDATE_SCHOLARSHIP_GRADES_SUCCESS: "UPDATE_SCHOLARSHIP_GRADES_SUCCESS",

    UPDATE_SCHOLARSHIP_NOTES: "UPDATE_SCHOLARSHIP_NOTES",
    UPDATE_SCHOLARSHIP_NOTES_SUCCESS: "UPDATE_SCHOLARSHIP_NOTES_SUCCESS",
    UPDATE_SCHOLARSHIP_NOTES_FAILURE: "UPDATE_SCHOLARSHIP_NOTES_FAILURE",

    UPDATE_SCHOLARSHIP_APPROVAL: "UPDATE_SCHOLARSHIP_APPROVAL",
    UPDATE_SCHOLARSHIP_APPROVAL_SUCCESS: "UPDATE_SCHOLARSHIP_APPROVAL_SUCCESS",
    UPDATE_SCHOLARSHIP_APPROVAL_FAILURE: "UPDATE_SCHOLARSHIP_APPROVAL_FAILURE",

    SEND_SCHOLARSHIP_EMAIL: "SEND_SCHOLARSHIP_EMAIL",
    SEND_SCHOLARSHIP_EMAIL_SUCCESS: "SEND_SCHOLARSHIP_EMAIL_SUCCESS",
    SEND_SCHOLARSHIP_EMAIL_ERROR: "SEND_SCHOLARSHIP_EMAIL_ERROR",
    SEND_SCHOLARSHIP_EMAIL_SENDING: "SEND_SCHOLARSHIP_EMAIL_SENDING",

    DELETE_SCHOLARSHIP: "DELETE_SCHOLARSHIP",
    DELETE_SCHOLARSHIP_SUCCESS: "DELETE_SCHOLARSHIP_SUCCESS",
    DELETE_SCHOLARSHIP_FAILURE: "DELETE_SCHOLARSHIP_FAILURE",

    setActiveTab: currentTab => ({
        type: actions.ACTIVE_SCHOLARSHIPS_TAB,
        payload: currentTab
    }),

    fetchScholarshipsStart: () => {
        return { type: actions.FETCH_SCHOLARSHIPS_START }
    },
    fetchScholarshipsSuccess: scholarships => ({
        type: actions.FETCH_SCHOLARSHIPS_SUCCESS,
        payload: scholarships
    }),

    fetchSingleApplicationState: sponsorshipId => ({
        type: actions.FETCH_SINGLE_SCHOLARSHIP_START,
        payload: sponsorshipId,
    }),
    fetchSingleScholarship: scholarship => ({
        type: actions.FETCH_SINGLE_SCHOLARSHIP_SUCCESS,
        payload: scholarship
    }),

    updateScholarshipPoints: (documentId, grades) => ({
        type: actions.UPDATE_SCHOLARSHIP_GRADES,
        grades: grades,
        documentId: documentId
    }),

    updateScholarshipNotes: (documentId, notes) => ({
        type: actions.UPDATE_SCHOLARSHIP_NOTES,
        notes: notes,
        documentId: documentId
    }),

    updateScholarshipApproval: (documentId, appType, status) => ({
        type: actions.UPDATE_SCHOLARSHIP_APPROVAL,
        approval: status,
        appType: appType,
        documentId: documentId
    }),

    sendScholarshipEmail: (userEmail, emailArray, userId, name, scholarshipType, approvalStatus) => ({
        type: actions.SEND_SCHOLARSHIP_EMAIL,
        userEmail: userEmail,
        emailArray: emailArray,
        userId: userId,
        name: name,
        scholarshipType: scholarshipType,
        approvalStatus: approvalStatus
    }),

    deleteScholarship: (documentId) => ({
        type: actions.DELETE_SCHOLARSHIP,
        documentId: documentId
    }),
}

export default actions;
