import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';


import { LOGOUT_SUCCESS } from "../actions/types";

const INITIAL_STATE = {
    access_token: '',
    client: '',
    uid: '',
    logged_in: false
};

const LoginReducer =  (state = INITIAL_STATE , action) => {

    switch (action.type) {
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