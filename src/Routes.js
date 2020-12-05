import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminAccounts from "./components/AdminAccounts";

export default function Routes() {

    return(

        <Router>

            <Switch>

                <Route exact path="/" component={Login} />


                <Route exact path="/home" component={Home} />


                <Route exact path="/admin-accounts" component={AdminAccounts} />





            </Switch>

        </Router>

    );

}