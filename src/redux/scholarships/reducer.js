import actions from "./actions";

const initState = {
    sponsorships: {},
    activeScholarshipsTab: "pendingDcc",
    loading: false,
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
        returnToArea: 0
    },
    scholarshipDeleted: false
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
                loading: false,
                error: false,
                users: users,
                scholarshipDeleted: false
            }
        case actions.FETCH_SCHOLARSHIPS_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case actions.FETCH_SINGLE_SCHOLARSHIP_SUCCESS:
            return {
                ...state,
                currentScholarship: payload,
                loading: false,
                error: false,
            }
        case actions.FETCH_SINGLE_SCHOLARSHIP_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case actions.UPDATE_SCHOLARSHIP_GRADES_SUCCESS:
            return {
                ...state,
                grades: payload
            }
        case actions.UPDATE_SCHOLARSHIP_NOTES_FAILURE:
            return {
                ...state,
                notesError: payload
            }
        case actions.UPDATE_SCHOLARSHIP_APPROVAL_SUCCESS:
            return {
                ...state,
                approval: payload
            }
        case actions.DELETE_SCHOLARSHIP_SUCCESS:
            console.log("test");
            return {
                ...state,
                scholarshipDeleted: true
            }
        default:
            return state
    }
}