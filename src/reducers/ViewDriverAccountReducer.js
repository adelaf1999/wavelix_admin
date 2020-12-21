import {
    LOGOUT_SUCCESS,
    GET_DRIVER_DATA,
    GET_DRIVER_DATA_COMPLETE,
    CLEAR_VIEW_DRIVER_ACCOUNT_STATE,
    DRIVER_ACCOUNT_REVIEWERS_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    profile_picture: '',
    name: '',
    phone_number: '',
    country: '',
    driver_verified: null,
    account_blocked: null,
    review_status: '',
    registered_at: '',
    latitude: null,
    longitude: null,
    driver_license_pictures: [],
    national_id_pictures: [],
    vehicle_registration_pictures: [],
    verified_by: '',
    admins_declined: [],
    unverified_reasons: [],
    email: '',
    current_reviewers: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DRIVER_ACCOUNT_REVIEWERS_CHANGED:
            return{
                ...state,
                current_reviewers: action.payload
            };
        case GET_DRIVER_DATA_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                profile_picture: action.payload.profile_picture,
                name: action.payload.name,
                phone_number: action.payload.phone_number,
                country: action.payload.country,
                driver_verified: action.payload.driver_verified,
                account_blocked: action.payload.account_blocked,
                review_status: action.payload.review_status,
                registered_at: action.payload.registered_at,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                driver_license_pictures: action.payload.driver_license_pictures,
                national_id_pictures: action.payload.national_id_pictures,
                vehicle_registration_pictures: action.payload.vehicle_registration_pictures,
                verified_by: action.payload.verified_by,
                admins_declined: action.payload.admins_declined,
                unverified_reasons: action.payload.unverified_reasons,
                email: action.payload.email
            };
        case GET_DRIVER_DATA:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_DRIVER_ACCOUNT_STATE:
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