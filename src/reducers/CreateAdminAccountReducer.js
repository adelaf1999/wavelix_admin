import {
    INITIALIZE_NEW_ADMIN_ACCOUNT,
    INITIALIZE_NEW_ADMIN_ACCOUNT_COMPLETE,
    LOGOUT_SUCCESS,
    CLEAR_CREATE_ADMIN_ACCOUNT_STATE,
    CREATE_ADMIN_ACCOUNT,
    CREATE_ADMIN_ACCOUNT_SUCCESS,
    CREATE_ADMIN_EMAIL_ERROR,
    CREATE_ADMIN_PASSWORD_ERROR,
    CREATE_ADMIN_FULL_NAME_ERROR,
    CREATE_ADMIN_PHOTO_ERROR,
    CREATE_ADMIN_ROLES_ERROR,
    CREATE_ADMIN_ERROR,
    CREATE_ADMIN_ACCOUNT_FAILURE,
    CLOSE_CREATE_ADMIN_SUCCESS_MODAL,
    CLEAR_CREATE_ADMIN_ACCOUNT_ERRORS
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    available_roles: [],
    email_invalid: false,
    email_error: '',
    password_invalid: false,
    password_error: '',
    full_name_invalid: false,
    full_name_error: '',
    profile_photo_error: '',
    roles_error: '',
    create_error: '',
    creating_account: false,
    create_success_modal_visible: false
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_CREATE_ADMIN_ACCOUNT_ERRORS:
            return{
                ...state,
                email_invalid: false,
                email_error: '',
                password_invalid: false,
                password_error: '',
                full_name_invalid: false,
                full_name_error: '',
                profile_photo_error: '',
                roles_error: '',
                create_error: ''
            };
        case CLOSE_CREATE_ADMIN_SUCCESS_MODAL:
            return{
                ...state,
                create_success_modal_visible: false
            };
        case CREATE_ADMIN_ACCOUNT_SUCCESS:
            return{
                ...state,
                email_invalid: false,
                email_error: '',
                password_invalid: false,
                password_error: '',
                full_name_invalid: false,
                full_name_error: '',
                profile_photo_error: '',
                roles_error: '',
                create_error: '',
                creating_account: false,
                create_success_modal_visible: true
            };
        case CREATE_ADMIN_ACCOUNT_FAILURE:
            return{
                ...state,
                creating_account: false
            };
        case CREATE_ADMIN_ERROR:
            return{
                ...state,
                create_error: action.payload
            };
        case CREATE_ADMIN_ROLES_ERROR:
            return{
                ...state,
                roles_error: action.payload
            };
        case CREATE_ADMIN_PHOTO_ERROR:
            return{
                ...state,
                profile_photo_error: action.payload
            };
        case CREATE_ADMIN_FULL_NAME_ERROR:
            return{
                ...state,
                full_name_invalid: true,
                full_name_error: action.payload
            };
        case CREATE_ADMIN_PASSWORD_ERROR:
            return{
                ...state,
                password_invalid: true,
                password_error: action.payload
            };
        case CREATE_ADMIN_EMAIL_ERROR:
            return{
                ...state,
                email_invalid: true,
                email_error: action.payload
            };
        case CREATE_ADMIN_ACCOUNT:
            return{
                ...state,

                creating_account: true
            };
        case INITIALIZE_NEW_ADMIN_ACCOUNT_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                available_roles: action.payload
            };
        case INITIALIZE_NEW_ADMIN_ACCOUNT:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_CREATE_ADMIN_ACCOUNT_STATE:
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