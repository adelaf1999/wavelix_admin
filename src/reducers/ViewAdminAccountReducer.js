import {
    LOGOUT_SUCCESS,
    VIEW_ADMIN_ACCOUNT,
    VIEW_ADMIN_ACCOUNT_SUCCESS,
    VIEW_ADMIN_ACCOUNT_FAILURE,
    CLEAR_VIEW_ADMIN_ACCOUNT_STATE,
    OPEN_CHANGE_PASSWORD_MODAL,
    CLOSE_CHANGE_PASSWORD_MODAL,
    CHANGE_ADMIN_ACCOUNT_PASSWORD,
    CHANGE_ADMIN_ACCOUNT_PASSWORD_FAILURE,
    CHANGE_ADMIN_ACCOUNT_PASSWORD_SUCCESS,
    OPEN_CHANGE_ROLES_MODAL,
    CLOSE_CHANGE_ROLES_MODAL,
    CHANGE_ADMIN_ACCOUNT_ROLES,
    CHANGE_ADMIN_ACCOUNT_ROLES_FAILURE,
    CHANGE_ADMIN_ACCOUNT_ROLES_SUCCESS
} from "../actions/types";


const INITIAL_STATE = {
    initializing_page: false,
    admin_profile_photo: '',
    admin_full_name: '',
    admin_email: '',
    admin_roles: [],
    available_roles: [],
    current_sign_in_ip: null,
    last_sign_in_ip: null,
    change_password_modal_visible: false,
    change_roles_modal_visible: false,
    editing_account: false,
    edit_account_success_message: '',
    edit_account_error_message: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_ADMIN_ACCOUNT_ROLES_SUCCESS:
            return{
                ...state,
                editing_account: false,
                admin_roles: action.payload.admin_roles,
                edit_account_success_message: action.payload.edit_account_success_message
            };
        case CHANGE_ADMIN_ACCOUNT_ROLES_FAILURE:
            return{
                ...state,
                editing_account: false,
                edit_account_error_message: action.payload
            };
        case CHANGE_ADMIN_ACCOUNT_ROLES:
            return{
                ...state,
                editing_account: true,
                edit_account_success_message: '',
                edit_account_error_message: ''
            };
        case CLOSE_CHANGE_ROLES_MODAL:
            return{
                ...state,
                change_roles_modal_visible: false,
                editing_account: false,
                edit_account_success_message: '',
                edit_account_error_message: ''
            };
        case OPEN_CHANGE_ROLES_MODAL:
            return{
                ...state,
                change_roles_modal_visible: true
            };
        case CHANGE_ADMIN_ACCOUNT_PASSWORD_SUCCESS:
            return{
                ...state,
                editing_account: false,
                edit_account_success_message: action.payload
            };
        case CHANGE_ADMIN_ACCOUNT_PASSWORD_FAILURE:
            return{
                ...state,
                editing_account: false,
                edit_account_error_message: action.payload
            };
        case CHANGE_ADMIN_ACCOUNT_PASSWORD:
            return{
                ...state,
                editing_account: true,
                edit_account_success_message: '',
                edit_account_error_message: ''
            };
        case CLOSE_CHANGE_PASSWORD_MODAL:
            return{
                ...state,
                change_password_modal_visible: false,
                editing_account: false,
                edit_account_success_message: '',
                edit_account_error_message: ''
            };
        case OPEN_CHANGE_PASSWORD_MODAL:
            return{
                ...state,
                change_password_modal_visible: true
            };
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