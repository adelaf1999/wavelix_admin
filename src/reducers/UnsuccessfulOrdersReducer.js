import {
    LOGOUT_SUCCESS,
    CLEAR_UNSUCCESSFUL_ORDERS_STATE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    drivers: [],
    countries: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                drivers: action.payload.drivers,
                countries: action.payload.countries
            };
        case INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_UNSUCCESSFUL_ORDERS_STATE:
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