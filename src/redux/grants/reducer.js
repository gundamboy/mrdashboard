import grantsActions  from "./actions";

const INITIAL_DATA = {
    grants: [],
    grantsLoading: false,
    grantsUpdateLoading: false,
    grantsActiveTab: "pending",
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
                grantsLoading: true,
                currentGrant: null
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
        case grantsActions.FETCH_SINGLE_GRANT_SUCCESS:
            return {
                ...state,
                currentGrant: action.currentGrant,
                grantsLoading: false,
                totalGrants: action.totalGrants,
                totalGrantsAmount: action.totalGrantsAmount
            };
        case grantsActions.FETCH_SINGLE_GRANT:
            return {
                ...state,
                totalGrants: null,
                totalGrantsAmount: null,
                grantsLoading: true,
            };
        case grantsActions.FETCH_SINGLE_GRANT_FAILURE:
            return {
                ...state,
                fetchSingleReferralError: action.payload,
                grantsLoading: false
            };
        case grantsActions.UPDATE_GRANT:
            return {
                ...state,
                grantsUpdateLoading: true,
            };
        case grantsActions.UPDATE_GRANT_SUCCESS:
            return {
                ...state,
                grantsUpdateLoading: false,
                grantUpdateError: null,
                currentGrant: action.currentGrant,
                grants: []
            };
        case grantsActions.UPDATE_GRANT_FAILURE:
            return {
                ...state,
                grantsUpdateLoading: false,
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
                sendingEmail: false
            };
        case grantsActions.SET_GRANT_TABLE_SORTER:
            return {
                ...state,
                grantTableSorter: action.payload
            };
        case grantsActions.DELETE_GRANT_START:
            return {
                ...state,
                grantDeleted: action.payload,
                currentGrant: null,
                grantsLoading: false,
            }
        default:
            return state
    }
}