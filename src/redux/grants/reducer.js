import grantsActions  from "./actions";

const INITIAL_DATA = {
    grants: [],
    grantsLoading: false,
    grantsUpdateLoading: false,
    grantsActiveTab: "pending"
}

export default function grantsReducer(state = INITIAL_DATA, action) {
    switch (action.type) {
        case grantsActions.GRANTS_ACTIVE_TAB:
            return {
                ...state,
                grantsActiveTab: action.payload
            };
        case grantsActions.FETCH_GRANTS_START:
            return {
                ...state,
                grantsLoading: true
            };
        case grantsActions.FETCH_GRANTS_SUCCESS:
            return {
                ...state,
                grants: action.payload,
                grantsLoading: false
            };
        case grantsActions.FETCH_GRANTS_FAILURE:
            return {
                ...state,
                fetchReferralsError: action.payload,
                grantsLoading: false
            };
        case grantsActions.FETCH_SINGLE_GRANT_START:
            return {
                ...state,
                grantsLoading: true
            };
        case grantsActions.FETCH_SINGLE_GRANT_SUCCESS:
            return {
                ...state,
                currentReferral: action.payload,
                grantsLoading: false
            };
        case grantsActions.FETCH_SINGLE_GRANT_FAILURE:
            return {
                ...state,
                fetchSingleReferralError: action.payload,
                grantsLoading: false
            };
        case grantsActions.UPDATE_GRANT_SUCCESS:
            return {
                ...state,
                grantUpdateStatus: true,
                grantUpdateError: null
            };
        case grantsActions.UPDATE_GRANT_FAILURE:
            return {
                ...state,
                grantUpdateStatus: false,
                grantUpdateError: action.payload
            };
        case grantsActions.UPDATE_GRANT_NOTES_SUCCESS:
            return {
                ...state,
                grantNotesUpdated: true,
                grantNotesError: false
            };
        case grantsActions.UPDATE_GRANT_NOTES_ERROR:
            return {
                ...state,
                grantNotesError: action.payload,
                grantNotesUpdated: false
            };
        case grantsActions.SEND_GRANT_EMAIL_START:
            return {
                ...state,
                grantEmailStatus: true,
                sendingEmail: true
            };
        case grantsActions.SEND_GRANT_EMAIL_SUCCESS:
            return {
                ...state,
                grantEmailStatus: true,
                sendingEmail: false
            };
        case grantsActions.SEND_GRANT_EMAIL_ERROR:
            return {
                ...state,
                grantEmailStatus: false,
                grantEmailError: action.payload,
                sendingEmail: true
            };
        case grantsActions.SET_GRANT_TABLE_SORTER:
            return {
                ...state,
                grantTableSorter: action.payload
            };
        default:
            return state
    }
}