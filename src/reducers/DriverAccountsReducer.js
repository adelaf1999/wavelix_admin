import {
    LOGOUT_SUCCESS,
    INITIALIZE_DRIVER_ACCOUNTS_PAGE,
    INITIALIZE_DRIVER_ACCOUNTS_PAGE_COMPLETE,
    CLEAR_DRIVER_ACCOUNTS_STATE
} from "../actions/types";


const INITIAL_STATE = {
    initializing_page: false,
    limit: 50,
    driver_accounts: [],
    review_status_options: {},
    countries: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_DRIVER_ACCOUNTS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                driver_accounts: action.payload.driver_accounts,
                review_status_options: action.payload.review_status_options,
                countries: action.payload.countries
            };
        case INITIALIZE_DRIVER_ACCOUNTS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_DRIVER_ACCOUNTS_STATE:
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
