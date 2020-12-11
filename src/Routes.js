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

            </Switch>

        </Router>

    );

}