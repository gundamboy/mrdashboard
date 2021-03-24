import sponsorshipActions from './actions';
import actions from "../scholarships/actions";

const INITIAL_DATA = {
    results: [],
    loading: false,
    saveLoading: false,
    emailLoading: false,
    error: false,
    applicationUpdated: false,
    emailSent: false,
    emailError: false,
    fbError: false,
    appDeleted: false,
    activeTab: "pending"
};

export default function sponsorshipsReducer(state = INITIAL_DATA, action) {
    switch (action.type) {
        case sponsorshipActions.INSERT_DUMMY_DATA:
            return {
                ...state,
            };
        case sponsorshipActions.ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.activeTab
            };
        case sponsorshipActions.INSERT_DUMMY_DATA_SUCCESS:
            return {
                ...state,
                dataInserted: action.dataInserted
            };
        case sponsorshipActions.FETCH_APPLICATIONS_SUCCESS:
            return {
                ...state,
                results: action.payload,
                loading: false,
                error: false,
                appDeleted: false,
                emailSent: false
            };
        case sponsorshipActions.FETCH_APPLICATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case sponsorshipActions.FETCH_SINGLE_APPLICATION:
            return {
                ...state,
                currentApp: action.currentApp,
                loading: false,
                error: false
            };
        case sponsorshipActions.FETCH_SINGLE_APPLICATION_SUCCESS:
            return {
                ...state,
                currentApp: action.currentApp,
                loading: false,
                error: false
            };
        case sponsorshipActions.UPDATE_APPLICATION:
            return {
                ...state,
                saveLoading: true,
                applicationUpdated: action.applicationUpdated,
                submitting: 0,
                updatedApp: action.updatedApp
            };
        case sponsorshipActions.UPDATE_APPLICATION_SUCCESS:
            return {
                ...state,
                saveLoading: false,
                applicationUpdated: action.applicationUpdated,
                updatedApp: action.updatedApp,
                currentApp: action.currentApp,
                results: []
            };
        case sponsorshipActions.SEND_EMAIL_SUCCESS:
            return {
                ...state,
                emailLoading: false,
                emailSent: action.emailSent,
                error: false,
                currentApp: action.currentApp,
            };
        case sponsorshipActions.SEND_EMAIL_ERROR:
            return {
                ...state,
                emailLoading: false,
                saveLoading: false,
                emailError: action.error,
                fbError: action.fbError
            };
        case sponsorshipActions.SEND_EMAIL:
            return {
                ...state,
                emailSent: false,
                emailLoading: true
            };
        case sponsorshipActions.DELETE_APPLICATION:
            return {
                ...state,
                id: action.id
            };
        case sponsorshipActions.DELETE_APPLICATION_SUCCESS:
            return {
                ...state,
                appDeleted: action.appDeleted,
                currentApp: null,
                id: null,
                emailSent: false,
                loading: false,
                error: false,
                results: []
            };
        case sponsorshipActions.SET_SPONSORSHIP_TABLE_SORTER:
            return {
                ...state,
                sponsorshipTableSorter: action.payload
            }
        default:
            return state
    }
}