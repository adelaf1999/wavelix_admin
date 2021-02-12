import {
    LOGOUT_SUCCESS,
    INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE,
    INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE,
    CLEAR_DRIVER_UNSUCCESSFUL_ORDERS_STATE,
    DRIVER_UNSUCCESSFUL_ORDERS_RESOLVERS_CHANGED,
    DRIVER_UNSUCCESSFUL_ORDERS_UPDATED,
    DRIVER_BALANCE_USD_CHANGED,
    DRIVER_ACCOUNT_STATUS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    unsuccessful_orders: [],
    driver_name: '',
    driver_phone_number: '',
    driver_country: '',
    driver_account_status: '',
    driver_balance_usd: '',
    driver_latitude: '',
    driver_longitude: '',
    current_resolvers: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DRIVER_ACCOUNT_STATUS_CHANGED:
            return{
                ...state,
                driver_account_status: action.payload
            };
        case DRIVER_BALANCE_USD_CHANGED:
            return{
                ...state,
                driver_balance_usd: action.payload
            };
        case DRIVER_UNSUCCESSFUL_ORDERS_UPDATED:
            return{
                ...state,
                unsuccessful_orders: action.payload
            };
        case DRIVER_UNSUCCESSFUL_ORDERS_RESOLVERS_CHANGED:
            return{
                ...state,
                current_resolvers: action.payload
            };
        case INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                unsuccessful_orders: action.payload.unsuccessful_orders,
                driver_name: action.payload.driver_name,
                driver_phone_number: action.payload.driver_phone_number,
                driver_country: action.payload.driver_country,
                driver_account_status: action.payload.driver_account_status,
                driver_balance_usd: action.payload.driver_balance_usd,
                driver_latitude: action.payload.driver_latitude,
                driver_longitude: action.payload.driver_longitude
            };
        case INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_DRIVER_UNSUCCESSFUL_ORDERS_STATE:
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
