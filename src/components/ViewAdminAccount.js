import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import _ from "lodash";
import {  Spinner, Image, Card, Row, Col ,  Button, Form, Modal, Alert} from "react-bootstrap";
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

        const {
            initializing_page,
            admin_profile_photo,
            admin_full_name,
            admin_email,
            admin_roles,
            available_roles,
            current_sign_in_ip,
            last_sign_in_ip
        } = this.props;

        if(initializing_page){

            return(

                <div className="center-container">

                    <div className="spinner-container">

                        <Spinner animation="border" variant="primary" />

                    </div>

                </div>


            );

        }else{

            return(

                <div className="page-container">

                    <div className="header-container">

                        <Image className="profile-photo" src={admin_profile_photo} thumbnail />

                    </div>


                    <div className="account-container">

                        <Card id="view-admin-account-card">



                            <Card.Body>


                                <Form>


                                    <Form.Group  >

                                        <Form.Label >
                                            Full Name
                                        </Form.Label>


                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={admin_full_name}
                                            />


                                    </Form.Group>


                                    <Form.Group >

                                        <Form.Label >
                                            Email
                                        </Form.Label>



                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={admin_email}
                                            />


                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Roles
                                        </Form.Label>



                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={getAdminRoles(admin_roles)}
                                            />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Current Sign In Ip
                                        </Form.Label>



                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.isEmpty(current_sign_in_ip) ? 'N/A' : current_sign_in_ip}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Last Sign In Ip
                                        </Form.Label>



                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.isEmpty(last_sign_in_ip) ? 'N/A' : last_sign_in_ip}
                                        />

                                    </Form.Group>


                                </Form>




                            </Card.Body>




                            <div id="view-admin-account-footer" >

                                <Button
                                    variant="outline-primary"
                                    className="view-admin-account-button"
                                    onClick={(e) => {

                                        e.preventDefault();




                                    }}
                                >
                                    Change Password
                                </Button>


                                <Button
                                    variant="outline-primary"
                                    className="view-admin-account-button"
                                    onClick={(e) => {

                                        e.preventDefault();



                                    }}
                                >
                                    Change Roles
                                </Button>


                                <Button
                                    variant="outline-danger"
                                    className="view-admin-account-button"
                                    onClick={(e) => {

                                        e.preventDefault();



                                    }}
                                >
                                    Delete Account
                                </Button>



                            </div>



                        </Card>

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
        available_roles,
        current_sign_in_ip,
        last_sign_in_ip
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
        available_roles,
        current_sign_in_ip,
        last_sign_in_ip
    };
};

export default connect(mapStateToProps, {
    viewAdminAccount,
    clearViewAdminAccountState
})(ViewAdminAccount);
