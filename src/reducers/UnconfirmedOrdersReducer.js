import {
    LOGOUT_SUCCESS,
    CLEAR_UNCONFIRMED_ORDERS_STATE,
    INITIALIZE_UNCONFIRMED_ORDERS_PAGE,
    INITIALIZE_UNCONFIRMED_ORDERS_PAGE_COMPLETE,
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    time_exceeded_filters: {},
    unconfirmed_orders: [],
    countries: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_UNCONFIRMED_ORDERS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                time_exceeded_filters: action.payload.time_exceeded_filters,
                unconfirmed_orders: action.payload.unconfirmed_orders,
                countries: action.payload.countries
            };
        case INITIALIZE_UNCONFIRMED_ORDERS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_UNCONFIRMED_ORDERS_STATE:
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