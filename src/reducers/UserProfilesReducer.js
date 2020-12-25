import {
    LOGOUT_SUCCESS,
    GET_USER_PROFILES,
    GET_USER_PROFILES_COMPLETE,
    CLEAR_USER_PROFILES_STATE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    limit: 50,
    profiles: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_USER_PROFILES_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                profiles: action.payload
            };
        case GET_USER_PROFILES:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_USER_PROFILES_STATE:
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
