import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import AdminAccounts from "./components/AdminAccounts";
import ViewAdminAccount from "./components/ViewAdminAccount";
import CreateAdminAccount from "./components/CreateAdminAccount";
import CustomerAccounts from  "./components/CustomerAccounts";
import ViewCustomerAccount from "./components/ViewCustomerAccount";
import StoreAccounts from "./components/StoreAccounts";
import ViewStoreAccount from "./components/ViewStoreAccount";
import DriverAccounts from "./components/DriverAccounts";
import ViewDriverAccount from "./components/ViewDriverAccount";
import UserProfiles from "./components/UserProfiles";
import ViewUserProfile from "./components/ViewUserProfile";
import PostCases from "./components/PostCases";
import ViewPostCase from "./components/ViewPostCase";

export default function Routes() {

    return(

        <Router>

            <Switch>

                <Route exact path="/" component={Login} />


                <Route exact path="/home" component={Home} />


                <Route exact path="/admin-accounts" component={AdminAccounts} />

                <Route exact path="/admin-accounts/admin_id=:admin_id" component={ViewAdminAccount} />

                <Route exact path="/admin-accounts/create" component={CreateAdminAccount} />


                <Route exact path="/customer-accounts" component={CustomerAccounts} />

                <Route exact path="/customer-accounts/customer_user_id=:customer_user_id" component={ViewCustomerAccount} />


                <Route exact path="/store-accounts" component={StoreAccounts} />

                <Route exact path="/store-accounts/store_user_id=:store_user_id" component={ViewStoreAccount} />


                <Route exact path="/driver-accounts" component={DriverAccounts} />

                <Route exact path="/driver-accounts/driver_id=:driver_id" component={ViewDriverAccount} />


                <Route exact path="/profiles" component={UserProfiles} />

                <Route exact path="/profiles/profile_id=:profile_id" component={ViewUserProfile} />


                <Route exact path="/post-cases" component={PostCases} />

                <Route exact path="/post-cases/post_case_id=:post_case_id" component={ViewPostCase} />




            </Switch>

        </Router>

    );

}