import {
    LOGOUT_SUCCESS,
    GET_STORE_DATA,
    GET_STORE_DATA_COMPLETE,
    CLEAR_VIEW_STORE_ACCOUNT_STATE,
    STORE_ACCOUNT_REVIEWERS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    store_owner: '',
    store_username: '',
    store_name: '',
    status: '',
    review_status: '',
    country: '',
    has_sensitive_products: null,
    business_license: '',
    registered_at: '',
    location: {},
    store_owner_number: '',
    store_number: '',
    verified_by: '',
    declined_verification: null,
    current_reviewers: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case STORE_ACCOUNT_REVIEWERS_CHANGED:
            return{
                ...state,
                current_reviewers: action.payload
            };
        case GET_STORE_DATA_COMPLETE:
            return{
                initializing_page: false,
                store_owner: action.payload.store_owner,
                store_username: action.payload.store_username,
                status: action.payload.status,
                review_status: action.payload.review_status,
                country: action.payload.country,
                has_sensitive_products: action.payload.has_sensitive_products,
                business_license: action.payload.business_license,
                registered_at: action.payload.registered_at,
                location: action.payload.location,
                store_owner_number: action.payload.store_owner_number,
                store_number: action.payload.store_number,
                verified_by: action.payload.verified_by,
                declined_verification: action.payload.declined_verification
            };
        case GET_STORE_DATA:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_STORE_ACCOUNT_STATE:
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