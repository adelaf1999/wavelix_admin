import {
    LOGOUT_SUCCESS,
    GET_CUSTOMER_ACCOUNTS,
    GET_CUSTOMER_ACCOUNTS_COMPLETE,
    CLEAR_CUSTOMER_ACCOUNTS_STATE,
    SEARCH_CUSTOMER_ACCOUNTS_COMPLETE,
    SEARCH_CUSTOMER_ACCOUNTS_LIMIT_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    customer_accounts: [],
    limit: 50
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_CUSTOMER_ACCOUNTS_LIMIT_CHANGED:
            return{
                ...state,
                limit: action.payload
            };
        case SEARCH_CUSTOMER_ACCOUNTS_COMPLETE:
            return{
                ...state,
                customer_accounts: action.payload
            };
        case GET_CUSTOMER_ACCOUNTS_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                customer_accounts: action.payload
            };
        case GET_CUSTOMER_ACCOUNTS:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_CUSTOMER_ACCOUNTS_STATE:
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