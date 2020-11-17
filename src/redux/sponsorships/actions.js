const sponsorshipActions = {
    APPLICATIONS: 'APPLICATIONS',
    FETCH_APPLICATIONS_START: 'FETCH_APPLICATIONS_START',
    FETCH_APPLICATIONS_SUCCESS: 'FETCH_APPLICATIONS_SUCCESS',
    FETCH_APPLICATIONS_FAILURE: 'FETCH_APPLICATIONS_FAILURE',

    SINGLE_APPLICATION: 'SINGLE_APPLICATION',
    FETCH_SINGLE_APPLICATION_START: 'FETCH_SINGLE_APPLICATION_START',
    FETCH_SINGLE_APPLICATION: 'FETCH_SINGLE_APPLICATION',
    UPDATE_APPLICATION: "UPDATE_APPLICATION",
    UPDATE_APPLICATION_SUCCESS: "UPDATE_APPLICATION_SUCCESS",

    SEND_EMAIL: "SEND_EMAIL",
    SEND_EMAIL_START: "SEND_EMAIL_START",
    SEND_EMAIL_SUCCESS: "SEND_EMAIL_SUCCESS",
    SEND_EMAIL_ERROR: "SEND_EMAIL_ERROR",

    fetchApplicationsStart: () => ({
        type: sponsorshipActions.FETCH_APPLICATIONS_START,
    }),
    fetchApplicationsSuccess: application => ({
        type: sponsorshipActions.FETCH_APPLICATIONS_SUCCESS,
        payload: application
    }),
    fetchApplicationsFailure: error => ({
        type: sponsorshipActions.FETCH_APPLICATIONS_FAILURE,
        payload: error
    }),

    loadFromFireStoreSuccess: data => ({
        type: sponsorshipActions.FETCH_APPLICATIONS_SUCCESS,
        payload: { data },
    }),

    fetchSingleApplicationStart: applicationId => ({
        type: sponsorshipActions.FETCH_SINGLE_APPLICATION_START,
        payload: applicationId
    }),

    fetchSingleApplication: application => ({
        type: sponsorshipActions.FETCH_SINGLE_APPLICATION,
        payload: application,
        currentApp: application
    }),

    updateApplication: application => ({
        type: sponsorshipActions.UPDATE_APPLICATION,
        payload: application,
    }),

    sendEmailStart: (application, email) => ({
        type: sponsorshipActions.SEND_EMAIL_START,
        payload: application
    }),
    sendEmail: (application, emailArray) => ({
        type: sponsorshipActions.SEND_EMAIL,
        payload: application,
        emailArray: emailArray
    }),

};
export default sponsorshipActions;
