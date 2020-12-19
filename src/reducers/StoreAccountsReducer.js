import {
    LOGOUT_SUCCESS,
    INITIALIZE_STORE_ACCOUNTS_PAGE,
    INITIALIZE_STORE_ACCOUNTS_PAGE_COMPLETE,
    CLEAR_STORE_ACCOUNTS_STATE,
    SEARCH_STORE_ACCOUNTS_COMPLETE,
    SEARCH_STORE_ACCOUNTS_LIMIT_CHANGED,
    STORE_ACCOUNTS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    limit: 50,
    store_accounts: [],
    account_status_options: {},
    review_status_options: {},
    countries: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case STORE_ACCOUNTS_CHANGED:
            return{
                ...state,
                store_accounts: action.payload
            };
        case SEARCH_STORE_ACCOUNTS_LIMIT_CHANGED:
            return{
                ...state,
                limit: action.payload
            };
        case SEARCH_STORE_ACCOUNTS_COMPLETE:
            return{
                ...state,
                store_accounts: action.payload
            };
        case INITIALIZE_STORE_ACCOUNTS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                store_accounts: action.payload.store_accounts,
                account_status_options: action.payload.account_status_options,
                review_status_options: action.payload.review_status_options,
                countries: action.payload.countries
            };
        case INITIALIZE_STORE_ACCOUNTS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_STORE_ACCOUNTS_STATE:
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
