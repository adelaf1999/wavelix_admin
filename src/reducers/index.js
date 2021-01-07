import {combineReducers} from 'redux';
import storage from 'redux-persist/lib/storage';
import { LOGOUT_SUCCESS } from "../actions/types";


import LoginReducer from "./LoginReducer";
import HomeReducer from "./HomeReducer";
import AdminAccountsReducer from "./AdminAccountsReducer";
import ViewAdminAccountReducer from "./ViewAdminAccountReducer";
import CreateAdminAccountReducer from "./CreateAdminAccountReducer";
import CustomerAccountsReducer from "./CustomerAccountsReducer";
import ViewCustomerAccountReducer from "./ViewCustomerAccountReducer";
import StoreAccountsReducer from "./StoreAccountsReducer";
import ViewStoreAccountReducer from "./ViewStoreAccountReducer";
import DriverAccountsReducer from "./DriverAccountsReducer";
import ViewDriverAccountReducer from "./ViewDriverAccountReducer";
import UserProfilesReducer from "./UserProfilesReducer";
import ViewUserProfileReducer from "./ViewUserProfileReducer";
import PostCasesReducer from "./PostCasesReducer";

const appReducer = combineReducers({
    login: LoginReducer,
    home: HomeReducer,
    admin_accounts: AdminAccountsReducer,
    view_admin_account: ViewAdminAccountReducer,
    create_admin_account: CreateAdminAccountReducer,
    customer_accounts: CustomerAccountsReducer,
    view_customer_account: ViewCustomerAccountReducer,
    store_accounts: StoreAccountsReducer,
    view_store_account: ViewStoreAccountReducer,
    driver_accounts: DriverAccountsReducer,
    view_driver_account: ViewDriverAccountReducer,
    user_profiles: UserProfilesReducer,
    view_user_profile: ViewUserProfileReducer,
    post_cases: PostCasesReducer
});


const rootReducer = ( state, action ) => {

    if ( action.type === LOGOUT_SUCCESS ) {

        storage.removeItem('login:access_token').then(() => console.log("access_token removed"));

        storage.removeItem('login:client').then(() => console.log("client removed"));

        storage.removeItem('login:uid').then(() => console.log("uid removed"));

        storage.removeItem('login:logged_in').then(() => console.log("logged_in removed"));

        storage.removeItem('login:roles').then(() => console.log("roles removed"));

        storage.removeItem('login:id').then(() => console.log("id removed"));

    }

    return appReducer(state, action);

};


export default rootReducer;