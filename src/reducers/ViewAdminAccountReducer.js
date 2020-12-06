import {
    LOGOUT_SUCCESS,
    VIEW_ADMIN_ACCOUNT,
    VIEW_ADMIN_ACCOUNT_SUCCESS,
    VIEW_ADMIN_ACCOUNT_FAILURE,
    CLEAR_VIEW_ADMIN_ACCOUNT_STATE
} from "../actions/types";


const INITIAL_STATE = {
    initializing_page: false,
    admin_profile_photo: '',
    admin_full_name: '',
    admin_email: '',
    admin_roles: [],
    available_roles: [],
    current_sign_in_ip: null,
    last_sign_in_ip: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case VIEW_ADMIN_ACCOUNT_SUCCESS:
            return{
                ...state,
                initializing_page: false,
                admin_profile_photo: action.payload.admin_profile_photo,
                admin_full_name: action.payload.admin_full_name,
                admin_email: action.payload.admin_email,
                admin_roles: action.payload.admin_roles,
                available_roles: action.payload.available_roles,
                current_sign_in_ip: action.payload.current_sign_in_ip === undefined ? null :  action.payload.current_sign_in_ip,
                last_sign_in_ip: action.payload.last_sign_in_ip === undefined ? null : action.payload.last_sign_in_ip
            };
        case VIEW_ADMIN_ACCOUNT_FAILURE:
            return{
                ...state,
                initializing_page: false
            };
        case VIEW_ADMIN_ACCOUNT:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_VIEW_ADMIN_ACCOUNT_STATE:
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