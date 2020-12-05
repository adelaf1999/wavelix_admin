import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getAdminAccounts,
    clearAdminAccountsState
} from "../actions";
import _ from "lodash";
import {  Spinner } from "react-bootstrap";

class AdminAccounts extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }

    componentWillUnmount(){
        this.props.clearAdminAccountsState();
    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getAdminAccounts
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("employee_manager") ){

            history.push("/home");

        }else{

            getAdminAccounts(access_token, client, uid, history);

        }



    }


    show(){

        const { initializing_page } = this.props;

        if(initializing_page){

            return(

                <div className="center-container">

                    <div className="spinner-container">

                        <Spinner animation="border" variant="primary" />

                    </div>

                </div>



            );

        }

    }

    render(){

        return(

            <Wrapper
                history={this.state.history}
            >

                <div>

                    <TopHeader
                        history={this.state.history}
                    />

                    {this.show()}

                </div>

            </Wrapper>

        );


    }


}

const mapStateToProps = (state) => {

    const {
        access_token,
        client,
        uid,
        logged_in,
        roles
    } = state.login;

    const {
        initializing_page,
        admins,
        available_roles
    } = state.admin_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        admins,
        available_roles
    };
};

export default connect(mapStateToProps, {
    getAdminAccounts,
    clearAdminAccountsState
})(AdminAccounts);
