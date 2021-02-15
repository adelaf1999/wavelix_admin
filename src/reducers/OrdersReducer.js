import {
    LOGOUT_SUCCESS,
    INITIALIZE_ORDERS_PAGE,
    INITIALIZE_ORDERS_PAGE_COMPLETE,
    CLEAR_ORDERS_PAGE_STATE,
    SEARCH_ORDERS_COMPLETE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    limit: 50,
    orders: [],
    status_options: {},
    countries: {}
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_ORDERS_COMPLETE:
            return{
                ...state,
                orders: action.payload
            };
        case INITIALIZE_ORDERS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                orders: action.payload.orders,
                status_options: action.payload.status_options,
                countries: action.payload.countries
            };
        case INITIALIZE_ORDERS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_ORDERS_PAGE_STATE:
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