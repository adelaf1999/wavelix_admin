import {
    CHANGE_CREDENTIAL,
    CHANGE_CREDENTIAL_ERROR,
    CHANGE_MY_EMAIL_SUCCESS,
    INITIALIZE_HOME_PAGE,
    INITIALIZE_HOME_PAGE_COMPLETE,
    LOGOUT_SUCCESS,
    OPEN_CREDENTIAL_MODAL,
    CLOSE_CREDENTIAL_MODAL,
    CHANGE_MY_PASSWORD_SUCCESS,
    CLEAR_HOME_STATE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    profile_photo: '',
    name: '',
    email: '',
    changing_credential: false,
    credential_error: '',
    credential_modal_visible: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLOSE_CREDENTIAL_MODAL:
            return{
                ...state,
                changing_credential: false,
                credential_error: '',
                credential_modal_visible: false
            };
        case OPEN_CREDENTIAL_MODAL:
            return{
                ...state,
                credential_modal_visible: true
            };
        case CHANGE_MY_PASSWORD_SUCCESS:
            return{
                ...state,
                changing_credential: false,
                credential_modal_visible: false
            };
        case CHANGE_MY_EMAIL_SUCCESS:
            return{
                ...state,
                changing_credential: false,
                credential_modal_visible: false,
                email: action.payload.email
            };
        case CHANGE_CREDENTIAL_ERROR:
            return{
                ...state,
                changing_credential: false,
                credential_error: action.payload
            };
        case CHANGE_CREDENTIAL:
            return{
                ...state,
                changing_credential: true,
                credential_error: ''
            };
        case INITIALIZE_HOME_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                profile_photo: action.payload.profile_photo,
                name: action.payload.name,
                email: action.payload.email
            };
        case INITIALIZE_HOME_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_HOME_STATE:
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