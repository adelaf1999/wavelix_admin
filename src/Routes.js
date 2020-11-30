import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./components/Login";

class Routes extends Component{

    constructor(props){
        super(props);
    }

    render(){

        return(

            <Router>

                <Switch>

                    <Route exact path="/" component={Login} />

                </Switch>

            </Router>

        );

    }

}

export default Routes;