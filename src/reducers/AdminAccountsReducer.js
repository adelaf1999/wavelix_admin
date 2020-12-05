import {
    LOGOUT_SUCCESS,
    GET_ADMIN_ACCOUNTS,
    GET_ADMIN_ACCOUNTS_COMPLETE,
    CLEAR_ADMIN_ACCOUNTS_STATE,
    SEARCH_ADMINS,
    SEARCH_ADMINS_COMPLETE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    admins: [],
    available_roles: [],
    searching_admins: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_ADMINS_COMPLETE:
            return{
                ...state,
                searching_admins: false,
                admins: action.payload
            };
        case SEARCH_ADMINS:
            return{
                ...state,
                searching_admins: true
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