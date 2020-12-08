import {
    LOGOUT_SUCCESS,
    GET_ADMIN_ACCOUNTS,
    GET_ADMIN_ACCOUNTS_COMPLETE,
    CLEAR_ADMIN_ACCOUNTS_STATE,
    SEARCH_ADMINS_COMPLETE,
    SEARCH_ADMINS_LIMIT_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    admins: [],
    available_roles: [],
    limit: 30
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_ADMINS_LIMIT_CHANGED:
            return{
                ...state,
                limit: action.payload
            };
        case SEARCH_ADMINS_COMPLETE:
            return{
                ...state,
                admins: action.payload
            };
        case GET_ADMIN_ACCOUNTS_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                admins: action.payload.admins,
                available_roles: action.payload.available_roles
            };
        case GET_ADMIN_ACCOUNTS:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_ADMIN_ACCOUNTS_STATE:
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