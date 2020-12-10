import {
    LOGOUT_SUCCESS,
    GET_CUSTOMER_DATA_COMPLETE,
    GET_CUSTOMER_DATA,
    CLEAR_VIEW_CUSTOMER_ACCOUNT_STATE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    full_name: '',
    email: '',
    username: '',
    building_name: '',
    apartment_floor: '',
    country: '',
    phone_number: '',
    current_sign_in_ip: '',
    last_sign_in_ip: '',
    profile_link: ''
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CUSTOMER_DATA_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                full_name: action.payload.full_name,
                email: action.payload.email,
                username: action.payload.username,
                building_name: action.payload.building_name,
                apartment_floor: action.payload.apartment_floor,
                country: action.payload.country,
                phone_number: action.payload.phone_number,
                current_sign_in_ip: action.payload.current_sign_in_ip,
                last_sign_in_ip: action.payload.last_sign_in_ip,
                profile_link: action.payload.profile_link
            };
        case GET_CUSTOMER_DATA:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_CUSTOMER_ACCOUNT_STATE:
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