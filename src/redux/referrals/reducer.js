import referralActions  from "./actions";

const INITIAL_DATA = {
    referrals: [],
    referralsLoading: false,
    referralsUpdateLoading: false,
    referralsActiveTab: "pending"
}

export default function referralsReducer(state = INITIAL_DATA, action) {
    switch (action.type) {
        case referralActions.REFERRALS_ACTIVE_TAB:
            return {
                ...state,
                referralsActiveTab: action.payload
            };
        case referralActions.FETCH_REFERRALS_START:
            return {
                ...state,
                referralsLoading: true
            };
        case referralActions.FETCH_REFERRALS_SUCCESS:
            return {
                ...state,
                referrals: action.payload,
                referralsLoading: false
            };
        case referralActions.FETCH_REFERRALS_FAILURE:
            return {
                ...state,
                fetchReferralsError: action.payload,
                referralsLoading: false
            };
        case referralActions.FETCH_SINGLE_REFERRAL_START:
            return {
                ...state,
                referralsLoading: true,
                currentReferral: null
            };
        case referralActions.FETCH_SINGLE_REFERRAL_SUCCESS:
            return {
                ...state,
                currentReferral: action.payload,
                referralsLoading: false
            };
        case referralActions.FETCH_SINGLE_REFERRAL_FAILURE:
            return {
                ...state,
                fetchSingleReferralError: action.payload,
                referralsLoading: false
            };
        case referralActions.UPDATE_REFERRAL_SUCCESS:
            return {
                ...state,
                referralUpdateStatus: true,
                referralUpdateError: null
            };
        case referralActions.UPDATE_REFERRAL_FAILURE:
            return {
                ...state,
                referralUpdateStatus: false,
                referralUpdateError: action.payload
            };
        case referralActions.UPDATE_REFERRAL_NOTES_SUCCESS:
            return {
                ...state,
                referralNotesUpdated: true,
                referralNotesError: false
            };
        case referralActions.UPDATE_REFERRAL_NOTES_ERROR:
            return {
                ...state,
                referralNotesError: action.payload,
                referralNotesUpdated: false
            };
        case referralActions.SEND_REFERRAL_EMAIL_START:
            return {
                ...state,
                referralEmailStatus: true,
                sendingEmail: true
            };
        case referralActions.SEND_REFERRAL_EMAIL_SUCCESS:
            return {
                ...state,
                referralEmailStatus: true,
                sendingEmail: false
            };
        case referralActions.SEND_REFERRAL_EMAIL_ERROR:
            return {
                ...state,
                referralEmailStatus: false,
                referralEmailError: action.payload,
                sendingEmail: true
            };
        case referralActions.SET_REFERRAL_TABLE_SORTER:
            return {
                ...state,
                referralTableSorter: action.payload
            };
        default:
            return state
    }
}