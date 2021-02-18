const actions = {
    ACTIVE_TAB: 'ACTIVE_TAB',

    FETCH_SCHOLARSHIPS_START: 'FETCH_SCHOLARSHIPS_START',
    FETCH_SCHOLARSHIPS_SUCCESS: 'FETCH_SCHOLARSHIPS_SUCCESS',
    FETCH_SCHOLARSHIPS_FAILURE: 'FETCH_SCHOLARSHIPS_FAILURE',

    FETCH_SINGLE_SCHOLARSHIP_START: 'FETCH_SINGLE_SCHOLARSHIP_START',
    FETCH_SINGLE_SCHOLARSHIP: 'FETCH_SINGLE_SCHOLARSHIP',
    FETCH_SINGLE_SCHOLARSHIP_SUCCESS: 'FETCH_SINGLE_SCHOLARSHIP_SUCCESS',
    FETCH_SINGLE_SCHOLARSHIP_FAILURE: 'FETCH_SINGLE_SCHOLARSHIP_FAILURE',

    UPDATE_SCHOLARSHIP: "UPDATE_SCHOLARSHIP",
    UPDATE_SCHOLARSHIP_SUCCESS: "UPDATE_SCHOLARSHIP_SUCCESS",

    setActiveTab: currentTab => ({
        type: actions.ACTIVE_TAB,
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
}

export default actions;