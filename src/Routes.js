import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./components/Login";


export default function Routes() {

    return(

        <Router>

            <Switch>

                <Route exact path="/" component={Login} />

            </Switch>

        </Router>

    );

}