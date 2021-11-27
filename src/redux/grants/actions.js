const grantsActions = {
    GRANTS_ACTIVE_TAB: 'GRANTS_ACTIVE_TAB',

    FETCH_GRANTS_START: 'FETCH_GRANTS_START',
    FETCH_GRANTS_SUCCESS: 'FETCH_GRANTS_SUCCESS',
    FETCH_GRANTS_FAILURE: 'FETCH_GRANTS_FAILURE',

    FETCH_SINGLE_GRANT_START: 'FETCH_SINGLE_GRANT_START',
    FETCH_SINGLE_GRANT: 'FETCH_SINGLE_GRANT',
    FETCH_SINGLE_GRANT_SUCCESS: 'FETCH_SINGLE_GRANT_SUCCESS',
    FETCH_SINGLE_GRANT_FAILURE: 'FETCH_SINGLE_GRANT_FAILURE',

    UPDATE_GRANT: "UPDATE_GRANT",
    UPDATE_GRANT_START: 'UPDATE_GRANT_START',
    UPDATE_GRANT_SUCCESS: 'UPDATE_GRANT_SUCCESS',
    UPDATE_GRANT_FAILURE: 'UPDATE_GRANT_FAILURE',

    SEND_GRANT_EMAIL_START: "SEND_GRANT_EMAIL_START",
    SEND_GRANT_EMAIL_SUCCESS: "SEND_GRANT_EMAIL_SUCCESS",
    SEND_GRANT_EMAIL_ERROR: "SEND_GRANT_EMAIL_ERROR",

    UPDATE_GRANT_NOTES_START: "UPDATE_GRANT_NOTES_START",
    UPDATE_GRANT_NOTES_SUCCESS: "UPDATE_GRANT_NOTES_SUCCESS",
    UPDATE_GRANT_NOTES_ERROR: "UPDATE_GRANT_NOTES_ERROR",

    DELETE_GRANT_START: "DELETE_GRANT_START",
    DELETE_GRANT_SUCCESS: "DELETE_GRANT_SUCCESS",
    DELETE_GRANT_ERROR: "DELETE_GRANT_ERROR",

    SET_GRANT_TABLE_SORTER: 'SET_GRANT_TABLE_SORTER',

    setGrantTableSorter: grantsTableSorter => ({
       type: grantsActions.SET_GRANT_TABLE_SORTER,
       payload: grantsTableSorter
    }),

    setGrantActiveTab: currentTab => ({
        type: grantsActions.GRANTS_ACTIVE_TAB,
        payload: currentTab
    }),

    fetchGrantsStart: () => ({
        type: grantsActions.FETCH_GRANTS_START
    }),

    fetchGrantsSuccess: grants => ({
        type: grantsActions.FETCH_GRANTS_SUCCESS,
        payload: grants
    }),

    fetchGrantsFailure: error => ({
        type: grantsActions.FETCH_GRANTS_FAILURE,
        payload: error
    }),

    fetchSingleGrantStart: grantId => ({
        type: grantsActions.FETCH_SINGLE_GRANT_START,
        payload: grantId
    }),

    fetchSingleGrant: grantId => ({
        type: grantsActions.FETCH_SINGLE_GRANT,
        payload: grantId
    }),


    updateGrantStart: (grantId, status) => ({
        type: grantsActions.UPDATE_GRANT_START,
        grantId: grantId,
        status: status

    }),

    updateGrant: application => ({
        type: grantsActions.UPDATE_GRANT,
        payload: application,
    }),

    updateGrantSuccess: updatedStatus => ({
        type: grantsActions.UPDATE_GRANT_SUCCESS,
        payload: updatedStatus
    }),

    updateGrantNotes: (grantId, notes) => ({
        type: grantsActions.UPDATE_GRANT_NOTES_START,
        notes: notes,
        grantId: grantId
    }),

    sendGrantEmailStart: (application, emailTextArray) => ({
        type: grantsActions.SEND_GRANT_EMAIL_START,
        payload: application,
        emailTextArray: emailTextArray,

    }),

    sendGrantEmailSuccess: emailStatus => ({
        type: grantsActions.SEND_GRANT_EMAIL_SUCCESS,
        payload: emailStatus
    }),

    sendGrantEmailFailure: (error, fbError) => ({
        type: grantsActions.SEND_GRANT_EMAIL_ERROR,
        error: error,
        grantsFirebaseEmailError: fbError
    }),

    deleteGrantStart: (id) => ({
        type: grantsActions.DELETE_GRANT_START,
        id: id
    }),
};

export default grantsActions;