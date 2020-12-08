import {combineReducers} from 'redux';
import storage from 'redux-persist/lib/storage';
import { LOGOUT_SUCCESS } from "../actions/types";


import LoginReducer from "./LoginReducer";
import HomeReducer from "./HomeReducer";
import AdminAccountsReducer from "./AdminAccountsReducer";
import ViewAdminAccountReducer from "./ViewAdminAccountReducer";
import CreateAdminAccountReducer from "./CreateAdminAccountReducer";


const appReducer = combineReducers({
    login: LoginReducer,
    home: HomeReducer,
    admin_accounts: AdminAccountsReducer,
    view_admin_account: ViewAdminAccountReducer,
    create_admin_account: CreateAdminAccountReducer
});


const rootReducer = ( state, action ) => {

    if ( action.type === LOGOUT_SUCCESS ) {

        storage.removeItem('login:access_token').then(() => console.log("access_token removed"));

        storage.removeItem('login:client').then(() => console.log("client removed"));

        storage.removeItem('login:uid').then(() => console.log("uid removed"));

        storage.removeItem('login:logged_in').then(() => console.log("logged_in removed"));

    }

    return appReducer(state, action);

};


export default rootReducer;