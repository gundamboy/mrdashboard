import actions from "./actions";

const initState = {
    sponsorships: {},
    activeScholarshipsTab: "pendingDcc",
    scholarshipLoading: false,
    grades: {
        gpa: 0,
        act: 0,
        rank: 0,
        schoolRelated: 0,
        community: 0,
        awards: 0,
        employment: 0,
        essays: 0,
        grammar: 0,
        returnToArea: 0,
    },
    scholarshipDeleted: false,
    scholarshipEmailError: false,
    scholarshipEmailSuccess: false
};

export default function reducer(state = initState, { type, payload, users }) {
    switch (type) {
        case actions.ACTIVE_SCHOLARSHIPS_TAB:
            return {
                ...state,
                activeScholarshipsTab: payload
            };
        case actions.FETCH_SCHOLARSHIPS_SUCCESS:
            return {
                ...state,
                scholarships: payload,
                scholarshipLoading: false,
                error: false,
                users: users,
                scholarshipDeleted: false,
                scholarshipEmailError: false,
                scholarshipEmailSuccess: false,
                adminIsSaving: false
            }
        case actions.FETCH_SCHOLARSHIPS_FAILURE:
            return {
                ...state,
                scholarshipLoading: false,
                error: true,
                adminIsSaving: false
            }
        case actions.FETCH_SINGLE_SCHOLARSHIP_START:
            return {
                ...state,
                currentScholarship: null,
            }
        case actions.FETCH_SINGLE_SCHOLARSHIP_SUCCESS:
            return {
                ...state,
                currentScholarship: payload,
                scholarshipLoading: false,
                error: false,
                adminIsSaving: false
            }
        case actions.FETCH_SINGLE_SCHOLARSHIP_FAILURE:
            return {
                ...state,
                scholarshipLoading: false,
                error: true,
                adminIsSaving: false
            }
        case actions.UPDATE_SCHOLARSHIP_START:
            return {
                ...state,
                adminIsSaving: true
            }
        case actions.UPDATE_SCHOLARSHIP_SUCCESS:
            return {
                ...state,
                currentScholarship: payload,
                adminIsSaving: false
            }
        case actions.DELETE_SCHOLARSHIP_SUCCESS:
            return {
                ...state,
                scholarshipDeleted: true,
                adminIsSaving: false
            }
        case actions.SET_SCHOLARSHIP_TABLE_SORTER:
            return {
                ...state,
                scholarshipTableSorter: payload
            }
        case actions.SEND_SCHOLARSHIP_EMAIL_ERROR:
            return {
                ...state,
                scholarshipEmailError: true,
                scholarshipEmailSuccess: false,
                emailLoading: false,
            }
        case actions.SEND_EMAIL_SUCCESS:
            return {
                ...state,
                emailLoading: false,
                emailSent: true,
                scholarshipEmailError: false,
                scholarshipFirebaseError: false
            };
        case actions.SEND_SCHOLARSHIP_EMAIL_SUCCESS:
            return {
                ...state,
                scholarshipEmailError: false,
                scholarshipEmailSuccess: true
            }
        default:
            return state
    }
}