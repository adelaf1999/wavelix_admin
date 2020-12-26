import {
    LOGOUT_SUCCESS,
    GET_USER_PROFILE,
    GET_USER_PROFILE_COMPLETE,
    CLEAR_VIEW_USER_PROFILE_STATE,
    PROFILE_STATUS_CHANGED,
    PROFILE_BLOCKED_BY_CHANGED,
    PROFILE_BLOCKED_REASONS_CHANGED,
    STORY_POSTS_CHANGED,
    PROFILE_POSTS_CHANGED,
    ADMINS_REQUESTED_BLOCK_CHANGED,
    BLOCK_REQUESTS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    profile_picture: '',
    username: '',
    email: '',
    user_type: '',
    status: '',
    blocked_by: '',
    profile_bio: '',
    story_posts: [],
    profile_posts: [],
    admins_requested_block: [],
    blocked_reasons: [],
    block_requests: [],
    customer_user_id: '',
    store_user_id: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLOCK_REQUESTS_CHANGED:
            return{
                ...state,
                block_requests: action.payload
            };
        case ADMINS_REQUESTED_BLOCK_CHANGED:
            return{
                ...state,
                admins_requested_block: action.payload
            };
        case PROFILE_POSTS_CHANGED:
            return{
                ...state,
                profile_posts: action.payload
            };
        case STORY_POSTS_CHANGED:
            return{
                ...state,
                story_posts: action.payload
            };
        case PROFILE_BLOCKED_REASONS_CHANGED:
            return{
                ...state,
                blocked_reasons: action.payload
            };
        case PROFILE_BLOCKED_BY_CHANGED:
            return{
                ...state,
                blocked_by: action.payload
            };
        case PROFILE_STATUS_CHANGED:
            return{
                ...state,
                status: action.payload
            };
        case GET_USER_PROFILE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                profile_picture: action.payload.profile_picture,
                username: action.payload.username,
                email: action.payload.email,
                user_type: action.payload.user_type,
                status: action.payload.status,
                blocked_by: action.payload.blocked_by,
                profile_bio: action.payload.profile_bio,
                story_posts: action.payload.story_posts,
                profile_posts: action.payload.profile_posts,
                admins_requested_block: action.payload.admins_requested_block,
                blocked_reasons: action.payload.blocked_reasons,
                block_requests: action.payload.block_requests,
                customer_user_id: action.payload.customer_user_id === undefined ? '' : action.payload.customer_user_id,
                store_user_id: action.payload.store_user_id === undefined ? '' : action.payload.store_user_id
            };
        case GET_USER_PROFILE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_USER_PROFILE_STATE:
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