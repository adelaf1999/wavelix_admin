import {
    LOGOUT_SUCCESS,
    CLEAR_POST_CASES_STATE,
    GET_POST_CASES,
    GET_POST_CASES_COMPLETE,
    SEARCH_POST_CASES_COMPLETE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    limit: 50,
    review_status_options: {},
    post_cases: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_POST_CASES_COMPLETE:
            return{
                ...state,
                post_cases: action.payload
            };
        case GET_POST_CASES_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                review_status_options: action.payload.review_status_options,
                post_cases: action.payload.post_cases
            };
        case GET_POST_CASES:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_POST_CASES_STATE:
            return{
                ...state,
                ...INITIAL_STATE
            };
        case LOGOUT_SUCCESS:
            return {
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};