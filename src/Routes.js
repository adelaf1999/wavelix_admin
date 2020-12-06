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

export default function Routes() {

    return(

        <Router>

            <Switch>

                <Route exact path="/" component={Login} />


                <Route exact path="/home" component={Home} />


                <Route exact path="/admin-accounts" component={AdminAccounts} />


                <Route exact path="/view-admin-account/admin_id=:admin_id" component={ViewAdminAccount} />



            </Switch>

        </Router>

    );

}