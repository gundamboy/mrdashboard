import sponsorshipActions from './actions';

const INITIAL_DATA = {
    results: [],
    loading: true,
    error: null,
    applicationUpdated: false,
    emailSent: false
};

export default function sponsorshipsReducer(state = INITIAL_DATA, action) {
    switch (action.type) {
        case sponsorshipActions.FETCH_APPLICATIONS_SUCCESS:
            return {
                ...state,
                results: action.payload,
                loading: false,
                error: null,
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
                error: null
            };
        case sponsorshipActions.UPDATE_APPLICATION:
            console.log("REDUCER! UPDATE_APPLICATION payload:", action);
            return {
                ...state,
                loading: false,
                applicationUpdated: action.applicationUpdated,
                submitting: 0,
                updatedApp: action.updatedApp
            };
        case sponsorshipActions.SEND_EMAIL_SUCCESS:
            console.log("REDUCER! SEND_EMAIL payload:", action.emailSent);
            return {
                ...state,
                loading: false,
                emailSent: action.emailSent
            };
        case sponsorshipActions.SEND_EMAIL:
            console.log("REDUCER! SEND_EMAIL payload:", action);
            return {
                ...state,
                loading: false,
                emailSent: false
            };
        default:
            return state
    }
}