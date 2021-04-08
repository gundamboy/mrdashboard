const referralActions = {
    REFERRALS_ACTIVE_TAB: 'REFERRALS_ACTIVE_TAB',

    FETCH_REFERRALS_START: 'FETCH_REFERRALS_START',
    FETCH_REFERRALS_SUCCESS: 'FETCH_REFERRALS_SUCCESS',
    FETCH_REFERRALS_FAILURE: 'FETCH_REFERRALS_FAILURE',

    FETCH_SINGLE_REFERRAL_START: 'FETCH_SINGLE_REFERRAL_START',
    FETCH_SINGLE_REFERRAL_SUCCESS: 'FETCH_SINGLE_REFERRAL_SUCCESS',
    FETCH_SINGLE_REFERRAL_FAILURE: 'FETCH_SINGLE_REFERRAL_FAILURE',

    UPDATE_REFERRAL_START: 'UPDATE_REFERRAL_START',
    UPDATE_REFERRAL_SUCCESS: 'UPDATE_REFERRAL_SUCCESS',
    UPDATE_REFERRAL_FAILURE: 'UPDATE_REFERRAL_FAILURE',

    SEND_REFERRAL_EMAIL_START: "SEND_REFERRAL_EMAIL_START",
    SEND_REFERRAL_EMAIL_SUCCESS: "SEND_REFERRAL_EMAIL_SUCCESS",
    SEND_REFERRAL_EMAIL_ERROR: "SEND_REFERRAL_EMAIL_ERROR",

    UPDATE_REFERRAL_NOTES_START: "UPDATE_REFERRAL_NOTES_START",
    UPDATE_REFERRAL_NOTES_SUCCESS: "UPDATE_REFERRAL_NOTES_SUCCESS",
    UPDATE_REFERRAL_NOTES_ERROR: "UPDATE_REFERRAL_NOTES_ERROR",

    SET_REFERRAL_TABLE_SORTER: 'SET_REFERRAL_TABLE_SORTER',

    setReferralTableSorter: referralTableSorter => ({
       type: referralActions.SET_REFERRAL_TABLE_SORTER,
       payload: referralTableSorter
    }),

    setReferralActiveTab: currentTab => ({
        type: referralActions.REFERRALS_ACTIVE_TAB,
        payload: currentTab
    }),

    fetchReferralsStart: () => ({
        type: referralActions.FETCH_REFERRALS_START
    }),

    fetchReferralsSuccess: referrals => ({
        type: referralActions.FETCH_REFERRALS_SUCCESS,
        payload: referrals
    }),

    fetchReferralsFailure: error => ({
        type: referralActions.FETCH_REFERRALS_FAILURE,
        payload: error
    }),

    fetchSingleReferralStart: referralId => ({
        type: referralActions.FETCH_SINGLE_REFERRAL_START,
        payload: referralId
    }),

    fetchSingleReferralSuccess: referral => ({
        type: referralActions.FETCH_SINGLE_REFERRAL_SUCCESS,
        payload: referral
    }),

    updateReferralStart: (referralId, status) => ({
        type: referralActions.UPDATE_REFERRAL_START,
        referralId: referralId,
        status: status

    }),

    updateReferralSuccess: updatedStatus => ({
        type: referralActions.UPDATE_REFERRAL_SUCCESS,
        payload: updatedStatus
    }),

    updateReferralNotes: (referralId, notes) => ({
        type: referralActions.UPDATE_REFERRAL_NOTES_START,
        notes: notes,
        referralId: referralId
    }),

    sendReferralEmailStart: (referrerEmail, refereeEmail, referrerName, personYouAreReferring, emailTextArray,
                             userId, status) => ({
        type: referralActions.SEND_REFERRAL_EMAIL_START,
        referrerEmail: referrerEmail,
        refereeEmail: refereeEmail,
        emailArray: emailTextArray,
        userId: userId,
        approvalStatus: status,
        referrerName: referrerName,
        personYouAreReferring: personYouAreReferring
    }),

    sendReferralEmailSuccess: emailStatus => ({
        type: referralActions.SEND_REFERRAL_EMAIL_SUCCESS,
        payload: emailStatus
    }),

    sendReferralEmailFailure: (error, fbError) => ({
        type: referralActions.SEND_REFERRAL_EMAIL_ERROR,
        error: error,
        referralsFirebaseEmailError: fbError
    }),
};

export default referralActions;