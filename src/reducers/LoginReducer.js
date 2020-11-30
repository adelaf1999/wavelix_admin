import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';


import {
    LOGOUT_SUCCESS,
    CHECK_EMAIL,
    CHECK_EMAIL_SUCCESS, CHECK_EMAIL_FAILURE
} from "../actions/types";

const INITIAL_STATE = {
    access_token: '',
    client: '',
    uid: '',
    logged_in: false,
    current_page: 1,
    loading: false,
    email_error: ''
};

const LoginReducer =  (state = INITIAL_STATE , action) => {

    switch (action.type) {
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
        'logged_in'
    ],
    stateReconciler: autoMergeLevel1
};

export default persistReducer(persistConfig, LoginReducer);