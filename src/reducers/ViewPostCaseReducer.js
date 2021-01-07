import {
    LOGOUT_SUCCESS,
    GET_POST_CASE,
    GET_POST_CASE_COMPLETE,
    CLEAR_VIEW_POST_CASE_STATE,
    POST_CASE_REVIEWERS_CHANGED,
    POST_CASE_DELETED_BY_CHANGED,
    POST_CASE_REVIEW_STATUS_CHANGED,
    POST_CASE_ADMINS_REVIEWED_CHANGED,
    POST_CASE_REVIEWED_BY_CHANGED,
    POST_CASE_POST_CHANGED,
    POST_CASE_POST_COMPLAINTS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    post: {},
    post_author_username: '',
    post_author_profile_id: '',
    review_status: '',
    deleted_by: '',
    post_complaints: [],
    admins_reviewed: [],
    reviewed_by: [],
    current_reviewers: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case POST_CASE_POST_COMPLAINTS_CHANGED:
            return{
                ...state,
                post_complaints: action.payload
            };
        case POST_CASE_POST_CHANGED:
            return{
                ...state,
                post: action.payload
            };
        case POST_CASE_REVIEWED_BY_CHANGED:
            return{
                ...state,
                reviewed_by: action.payload
            };
        case POST_CASE_ADMINS_REVIEWED_CHANGED:
            return{
                ...state,
                admins_reviewed: action.payload
            };
        case  POST_CASE_REVIEW_STATUS_CHANGED:
            return{
                ...state,
                review_status: action.payload
            };
        case POST_CASE_DELETED_BY_CHANGED:
            return{
                ...state,
                deleted_by: action.payload
            };
        case POST_CASE_REVIEWERS_CHANGED:
            return{
                ...state,
                current_reviewers: action.payload
            };
        case GET_POST_CASE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                post: action.payload.post,
                post_author_username: action.payload.post_author_username,
                post_author_profile_id: action.payload.post_author_profile_id,
                review_status: action.payload.review_status,
                deleted_by: action.payload.deleted_by,
                post_complaints: action.payload.post_complaints,
                admins_reviewed: action.payload.admins_reviewed,
                reviewed_by: action.payload.reviewed_by
            };
        case GET_POST_CASE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_POST_CASE_STATE:
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
}

