import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';


import {
    LOGOUT_SUCCESS,
    CHECK_EMAIL,
    CHECK_EMAIL_SUCCESS,
    CHECK_EMAIL_FAILURE,
    LOGIN_ADMIN,
    LOGIN_ADMIN_FAILURE,
    LOGIN_ADMIN_SUCCESS,
    LOGIN_PAGE_CHANGED,
    RESEND_AUTH_EMAIL,
    RESEND_AUTH_EMAIL_COMPLETE,
    CLOSE_EMAIL_MODAL,
    GET_ROLES_COMPLETE,
    OPEN_TIMEOUT_MODAL,
    CLOSE_TIMEOUT_MODAL,
    CHANGE_MY_EMAIL_SUCCESS,
    ROLES_CHANGED
} from "../actions/types";

const INITIAL_STATE = {
    access_token: '',
    client: '',
    uid: '',
    logged_in: false,
    roles: [],
    current_page: 1,
    loading: false,
    email_error: '',
    login_errors: [],
    resending_email: false,
    email_modal_visible: false,
    timeout_modal_visible: false
};

const LoginReducer =  (state = INITIAL_STATE , action) => {

    switch (action.type) {
        case ROLES_CHANGED:
            return{
                ...state,
                roles: action.payload
            };
        case CHANGE_MY_EMAIL_SUCCESS:
            return{
                ...state,
                uid: action.payload.uid
            };
        case CLOSE_TIMEOUT_MODAL:
            return{
                ...state,
                timeout_modal_visible: false
            };
        case OPEN_TIMEOUT_MODAL:
            return{
                ...state,
                timeout_modal_visible: true
            };
        case GET_ROLES_COMPLETE:
            return{
                ...state,
                roles: action.payload
            };
        case CLOSE_EMAIL_MODAL:
            return{
                ...state,
                email_modal_visible: false
            };
        case RESEND_AUTH_EMAIL_COMPLETE:
            return{
                ...state,
                resending_email: false,
                email_modal_visible: true
            };
        case RESEND_AUTH_EMAIL:
            return{
                ...state,
                resending_email: true
            };
        case LOGIN_PAGE_CHANGED:
            return{
                ...state,
                current_page: 1
            };
        case LOGIN_ADMIN_SUCCESS:
            return{
                ...state,
                loading: false,
                access_token: action.payload.access_token,
                client: action.payload.client,
                uid: action.payload.uid,
                logged_in: true,
                roles: action.payload.roles
            };
        case LOGIN_ADMIN_FAILURE:
            return{
                ...state,
                loading: false,
                login_errors: action.payload
            };
        case LOGIN_ADMIN:
            return{
                ...state,
                loading: true,
                login_errors: []
            };
        case CHECK_EMAIL_FAILURE:
            return{
                ...state,
                loading: false,
                email_error: action.payload
            };
        case CHECK_EMAIL_SUCCESS:
            return{
                ...state,
                loading: false,
                current_page: 2
            };
        case CHECK_EMAIL:
            return{
                ...state,
                loading: true,
                email_error: ''
            };
        case LOGOUT_SUCCESS:
            return{
                ...INITIAL_STATE
            };
        default:
            return state;

    }

};

const persistConfig = {
    key: 'login',
    storage,
    whitelist: [
        'access_token',
        'client',
        'uid',
        'logged_in',
        'roles'
    ],
    stateReconciler: autoMergeLevel1
};

export default persistReducer(persistConfig, LoginReducer);