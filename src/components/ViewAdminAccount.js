import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table, Image} from "react-bootstrap";
import { getAdminRoles } from "../helpers";
import {
    viewAdminAccount,
    clearViewAdminAccountState
} from "../actions";


class ViewAdminAccount extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const params = props.match.params;

        this.state = {
            history,
            params
        };

    }

    componentWillUnmount(){
        this.props.clearViewAdminAccountState();
    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            viewAdminAccount
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("employee_manager") ){

            history.push("/home");

        }else{

            const admin_id = this.state.params.admin_id;

            viewAdminAccount(admin_id, access_token, client, uid, history);


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
        admin_profile_photo,
        admin_full_name,
        admin_email,
        admin_roles,
        available_roles
    } = state.view_admin_account;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        admin_profile_photo,
        admin_full_name,
        admin_email,
        admin_roles,
        available_roles
    };
};

export default connect(mapStateToProps, {
    viewAdminAccount,
    clearViewAdminAccountState
})(ViewAdminAccount);
