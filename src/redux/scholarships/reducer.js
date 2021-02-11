import actions from "./actions";

const initState = {
    sponsorships: {},
    activeTab: "pendingDcc",
    loading: false
};

export default function reducer(state = initState, { type, payload, newRecord }) {
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