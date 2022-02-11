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
    UPDATE_SCHOLARSHIP_START: "UPDATE_SCHOLARSHIP_START",
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

    SET_SCHOLARSHIP_TABLE_SORTER: "SET_SCHOLARSHIP_TABLE_SORTER",

    SEND_EMAIL_SUCCESS: "SEND_EMAIL_SUCCESS",
    SET_SCHOLARSHIP_YEAR: "SET_SCHOLARSHIP_YEAR",

    setScholarshipTableSorter: scholarshipTableSorter => ({
        type: actions.SET_SCHOLARSHIP_TABLE_SORTER,
        payload: scholarshipTableSorter
    }),

    setActiveTab: currentTab => ({
        type: actions.ACTIVE_SCHOLARSHIPS_TAB,
        payload: currentTab
    }),

    fetchScholarshipsStart: (scholarshipYear) => {
        return {
            type: actions.FETCH_SCHOLARSHIPS_START,
            scholarshipYear: scholarshipYear

        }
    },
    fetchScholarshipsSuccess: scholarships => ({
        type: actions.FETCH_SCHOLARSHIPS_SUCCESS,
        payload: scholarships
    }),

    fetchSingleApplicationStart: scholarshipId => ({
        type: actions.FETCH_SINGLE_SCHOLARSHIP_START,
        payload: scholarshipId,
    }),
    fetchSingleScholarship: scholarship => ({
        type: actions.FETCH_SINGLE_SCHOLARSHIP_SUCCESS,
        payload: scholarship
    }),


    updateScholarshipStart: (documentId, appType, grades, notes, approval, purchaseOrderNumber) => ({
        type: actions.UPDATE_SCHOLARSHIP_START,
        documentId: documentId,
        approval: approval,
        appType: appType,
        grades: grades,
        notes: notes,
        adminIsSaving: true,
        purchaseOrderNumber: purchaseOrderNumber
    }),

    setScholarshipYear: (scholarshipYear) => ({
        type: actions.SET_SCHOLARSHIP_YEAR,
        scholarshipYear: scholarshipYear
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

    scholarshipsEmailError: (error, fbError) => ({
        type: actions.SEND_SCHOLARSHIP_EMAIL_ERROR,
        error: error,
        scholarshipFirebaseError: fbError
    }),

    scholarshipsEmailSuccess: () => ({
        type: actions.SEND_SCHOLARSHIP_EMAIL_SUCCESS,
    }),
}

export default actions;
