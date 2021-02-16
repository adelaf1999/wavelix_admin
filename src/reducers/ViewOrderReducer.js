import {
    LOGOUT_SUCCESS,
    INITIALIZE_VIEW_ORDER_PAGE,
    INITIALIZE_VIEW_ORDER_PAGE_COMPLETE,
    CLEAR_VIEW_ORDER_STATE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    products: [],
    driver_id: '',
    driver_name: '',
    status: '',
    delivery_location: {},
    ordered_at: '',
    store_user_id: '',
    store_name: '',
    customer_user_id: '',
    customer_name: '',
    country: '',
    delivery_fee: '',
    delivery_fee_currency: '',
    order_type: '',
    store_confirmation_status: '',
    store_handles_delivery: null,
    customer_canceled_order: null,
    order_canceled_reason: '',
    store_fulfilled_order: null,
    driver_fulfilled_order: null,
    total_price: '',
    total_price_currency: '',
    delivery_time_limit: '',
    store_arrival_time_limit: '',
    receipt_url: '',
    confirmed_by: '',
    canceled_by: '',
    resolve_time_limit: '',
    store_payments: [],
    driver_payments: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_VIEW_ORDER_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                products: action.payload.products,
                driver_id: action.payload.driver_id === undefined ? '' : action.payload.driver_id,
                driver_name: action.payload.driver_name === undefined ? '' : action.payload.driver_name,
                status: action.payload.status,
                delivery_location: action.payload.delivery_location,
                ordered_at: action.payload.ordered_at,
                store_user_id: action.payload.store_user_id,
                store_name: action.payload.store_name,
                customer_user_id: action.payload.customer_user_id,
                customer_name: action.payload.customer_name,
                country: action.payload.country,
                delivery_fee: action.payload.delivery_fee === undefined ? '' : action.payload.delivery_fee,
                delivery_fee_currency: action.payload.delivery_fee_currency === undefined ? '' : action.payload.delivery_fee_currency,
                order_type: action.payload.order_type === undefined ? '' : action.payload.order_type,
                store_confirmation_status: action.payload.store_confirmation_status,
                store_handles_delivery: action.payload.store_handles_delivery,
                customer_canceled_order: action.payload.customer_canceled_order,
                order_canceled_reason: action.payload.order_canceled_reason === undefined ? '' : action.payload.order_canceled_reason,
                store_fulfilled_order: action.payload.store_fulfilled_order === undefined ? null : action.payload.store_fulfilled_order,
                driver_fulfilled_order: action.payload.driver_fulfilled_order === undefined ? null : action.payload.driver_fulfilled_order,
                total_price: action.payload.total_price,
                total_price_currency: action.payload.total_price_currency,
                delivery_time_limit: action.payload.delivery_time_limit === undefined ? '' : action.payload.delivery_time_limit,
                store_arrival_time_limit: action.payload.store_arrival_time_limit === undefined ? '' : action.payload.store_arrival_time_limit,
                receipt_url: action.payload.receipt_url === undefined ? '' : action.payload.receipt_url,
                confirmed_by: action.payload.confirmed_by === undefined ? '' : action.payload.confirmed_by,
                canceled_by: action.payload.canceled_by === undefined ? '' : action.payload.canceled_by,
                resolve_time_limit: action.payload.resolve_time_limit === undefined ? '' : action.payload.resolve_time_limit,
                store_payments: action.payload.store_payments,
                driver_payments: action.payload.driver_payments
            };
        case INITIALIZE_VIEW_ORDER_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_ORDER_STATE:
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