import actions from "./actions";

const initState = {
    sponsorships: {},
    activeTab: "pendingDcc",
    loading: false,
    grades: {
        isMember: "",
        pastWinner: "",
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
        total: 0
    },
};

export default function reducer(state = initState, { type, payload, users }) {
    switch (type) {
        case actions.ACTIVE_TAB:
            return {
                ...state,
                activeTab: payload.activeTab
            };
        case actions.FETCH_SCHOLARSHIPS_SUCCESS:
            return {
                ...state,
                scholarships: payload,
                loading: false,
                error: false,
                users: users
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
        default:
            return state
    }
}