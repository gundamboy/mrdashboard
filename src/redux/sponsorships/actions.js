const sponsorshipActions = {
    INSERT_DUMMY_DATA: 'INSERT_DUMMY_DATA',
    INSERT_DUMMY_DATA_SUCCESS: 'INSERT_DUMMY_DATA_SUCCESS',

    ACTIVE_TAB: 'ACTIVE_TAB',

    APPLICATIONS: 'APPLICATIONS',
    FETCH_APPLICATIONS_START: 'FETCH_APPLICATIONS_START',
    FETCH_APPLICATIONS_SUCCESS: 'FETCH_APPLICATIONS_SUCCESS',
    FETCH_APPLICATIONS_FAILURE: 'FETCH_APPLICATIONS_FAILURE',

    SINGLE_APPLICATION: 'SINGLE_APPLICATION',
    FETCH_SINGLE_APPLICATION_START: 'FETCH_SINGLE_APPLICATION_START',
    FETCH_SINGLE_APPLICATION: 'FETCH_SINGLE_APPLICATION',
    FETCH_SINGLE_APPLICATION_SUCCESS: 'FETCH_SINGLE_APPLICATION_SUCCESS',
    FETCH_SINGLE_APPLICATION_ERROR: 'FETCH_SINGLE_APPLICATION_ERROR',

    UPDATE_APPLICATION: "UPDATE_APPLICATION",
    UPDATE_APPLICATION_SUCCESS: "UPDATE_APPLICATION_SUCCESS",

    SEND_EMAIL: "SEND_EMAIL",
    SEND_EMAIL_START: "SEND_EMAIL_START",
    SEND_EMAIL_SUCCESS: "SEND_EMAIL_SUCCESS",
    SEND_EMAIL_ERROR: "SEND_EMAIL_ERROR",

    DELETE_APPLICATION_START: "DELETE_APPLICATION_START",
    DELETE_APPLICATION: "DELETE_APPLICATION",
    DELETE_APPLICATION_SUCCESS: "DELETE_APPLICATION_SUCCESS",
    DELETE_APPLICATION_ERROR: "DELETE_APPLICATION_ERROR",

    addDummyData: dataType => ({
        type: sponsorshipActions.INSERT_DUMMY_DATA,
        dataType: dataType
    }),

    setActiveTab: currentTab => ({
        type: sponsorshipActions.ACTIVE_TAB,
        activeTab: currentTab
    }),

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
    fetchSingleApplication: sponsorshipId => ({
        type: sponsorshipActions.FETCH_SINGLE_APPLICATION,
        payload: sponsorshipId,
    }),

    loadFromFireStoreSuccess: data => ({
        type: sponsorshipActions.FETCH_APPLICATIONS_SUCCESS,
        payload: { data },
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
        emailArray: emailArray,
    }),
    emailError: (error, fbError) => ({
        type: sponsorshipActions.SEND_EMAIL_ERROR,
        error: error,
        fbError: fbError
    }),

    deleteSponsorship: (id) => ({
        type:sponsorshipActions.DELETE_APPLICATION,
        id: id,
    }),
    deleteSponsorshipError: (error) => ({
        type: sponsorshipActions.DELETE_APPLICATION_ERROR,
        error: error
    })


};
export default sponsorshipActions;
