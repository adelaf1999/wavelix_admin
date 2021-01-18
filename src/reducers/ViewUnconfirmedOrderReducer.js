import {
    LOGOUT_SUCCESS,
    GET_UNCONFIRMED_ORDER,
    GET_UNCONFIRMED_ORDER_COMPLETE,
    CLEAR_VIEW_UNCONFIRMED_ORDER_STATE,
    UNCONFIRMED_ORDER_REVIEWERS_CHANGED,
    UNCONFIRMED_ORDER_RECEIPT_URL_CHANGED,
    OPEN_UNCONFIRMED_ORDER_LOADING_MODAL,
    CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    current_reviewers: [],
    store_name: '',
    store_user_id: '',
    store_owner: '',
    store_owner_number: '',
    store_number: '',
    store_has_sensitive_products: null,
    customer_name: '',
    customer_user_id: '',
    customer_number: '',
    country: '',
    delivery_time_limit: '',
    ordered_at: '',
    total_price: '',
    total_price_currency: '',
    receipt_url: null,
    products: [],
    delivery_location: {},
    unconfirmed_order_loading_modal_visible: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL:
            return{
                ...state,
                unconfirmed_order_loading_modal_visible: false
            };
        case OPEN_UNCONFIRMED_ORDER_LOADING_MODAL:
            return{
                ...state,
                unconfirmed_order_loading_modal_visible: true
            };
        case UNCONFIRMED_ORDER_RECEIPT_URL_CHANGED:
            return{
                ...state,
                receipt_url: action.payload
            };
        case UNCONFIRMED_ORDER_REVIEWERS_CHANGED:
            return{
                ...state,
                current_reviewers: action.payload
            };
        case GET_UNCONFIRMED_ORDER_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                store_name: action.payload.store_name,
                store_user_id: action.payload.store_user_id,
                store_owner: action.payload.store_owner,
                store_owner_number: action.payload.store_owner_number,
                store_number: action.payload.store_number,
                store_has_sensitive_products: action.payload.store_has_sensitive_products,
                customer_name: action.payload.customer_name,
                customer_user_id: action.payload.customer_user_id,
                customer_number: action.payload.customer_number,
                country: action.payload.country,
                delivery_time_limit: action.payload.delivery_time_limit,
                ordered_at: action.payload.ordered_at,
                total_price: action.payload.total_price,
                total_price_currency: action.payload.total_price_currency,
                receipt_url: action.payload.receipt_url,
                products: action.payload.products,
                delivery_location: action.payload.delivery_location

            };
        case GET_UNCONFIRMED_ORDER:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_UNCONFIRMED_ORDER_STATE:
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