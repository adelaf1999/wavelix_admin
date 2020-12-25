import {
    LOGOUT_SUCCESS,
    GET_USER_PROFILE,
    GET_USER_PROFILE_COMPLETE,
    CLEAR_VIEW_USER_PROFILE_STATE
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
    block_requests: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
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
                block_requests: action.payload.block_requests
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