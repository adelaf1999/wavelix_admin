import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import _ from "lodash";
import {  Spinner, Image, Card,  Button, Form, Modal, Alert} from "react-bootstrap";
import { getAdminRoles } from "../helpers";
import {
    viewAdminAccount,
    clearViewAdminAccountState,
    changeAdminAccountPassword,
    openChangePasswordModal,
    closeChangePasswordModal,
    destroyAdminAccount
} from "../actions";


class ViewAdminAccount extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const params = props.match.params;

        const password = "";

        const destroy_account_modal_visible = false;

        this.state = {
            history,
            params,
            password,
            destroy_account_modal_visible
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

    exitChangePasswordModal(){

        this.props.closeChangePasswordModal();

        this.setState({password: ''});

    }

    changingPasswordSpinner(){

        const { changing_password } = this.props;

        if(changing_password){

            return(

                <div className="spinner-container">

                    <Spinner animation="border" variant="primary" />

                </div>


            );

        }

    }

    passwordMessage(){

        const { password_success_message, password_error_message } = this.props;

        if(password_error_message.length > 0){

            return(
                <Alert variant="danger">
                    {password_error_message}
                </Alert>
            );

        }else if(password_success_message.length > 0){

            return(
                <Alert variant="success">
                    {password_success_message}
                </Alert>
            );

        }


    }


    changePasswordButton(){

        const { password, history } = this.state;

        const { access_token, client, uid, changeAdminAccountPassword } = this.props;

        const admin_id = this.state.params.admin_id;

        if(!_.isEmpty(password) && password.length >=8 ){


            return(

                <Button
                    variant="primary"
                    onClick={(e) => {

                        e.preventDefault();

                        changeAdminAccountPassword(admin_id, password, access_token, client, uid, history);

                    }}
                >
                    Submit
                </Button>

            );

        }else{

            return(

                <Button
                    disabled
                    variant="primary"
                >
                    Submit
                </Button>

            );

        }

    }

    changePasswordModal(){

        const {  change_password_modal_visible } = this.props;

        if(change_password_modal_visible){

            return(

                <Modal
                    show={change_password_modal_visible}
                    onHide={() => {
                        this.exitChangePasswordModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Change Password</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>


                        <Form.Group >

                            <Form.Label>
                                 Password ( at least 8 characters long )
                            </Form.Label>

                            <Form.Control
                                type='password'
                                placeholder='password'
                                onChange={(e) => {

                                    e.preventDefault();

                                    this.setState({password: e.target.value});

                                }}
                            />

                        </Form.Group>

                        {this.changingPasswordSpinner()}

                        {this.passwordMessage()}



                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                this.exitChangePasswordModal();
                            }}
                        >
                            Close
                        </Button>


                        {this.changePasswordButton()}

                    </Modal.Footer>


                </Modal>

            );

        }

    }

    exitDestroyAccountModal(){
        this.setState({destroy_account_modal_visible: false});
    }

    destroyAccountModalBody(){

        const { roles } = this.props;

        if(!roles.includes("root_admin")){

            return(

                <Modal.Body>

                    <p>The account will be permanently delete. Please inform the administrator before deleting an admin account</p>

                </Modal.Body>

            );


        }else{

            return(

                <Modal.Body>

                    <p>The account will be permanently deleted.</p>

                </Modal.Body>

            );

        }


    }

    destroyAccountModal(){

        const { destroy_account_modal_visible, history } = this.state;

        const { access_token, client, uid, destroyAdminAccount } = this.props;

        const admin_id = this.state.params.admin_id;

        if(destroy_account_modal_visible){

            return(

                <Modal
                    show={destroy_account_modal_visible}
                    onHide={() => {
                        this.exitDestroyAccountModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Are you sure?</Modal.Title>

                    </Modal.Header>


                    {this.destroyAccountModalBody()}

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                this.exitDestroyAccountModal();
                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant="danger"
                            onClick={(e) => {

                                e.preventDefault();

                                destroyAdminAccount(admin_id, access_token, client, uid, history );

                            }}
                        >
                            Delete Account
                        </Button>




                    </Modal.Footer>


                </Modal>


            );

        }

    }

    show(){

        const {
            initializing_page,
            admin_profile_photo,
            admin_full_name,
            admin_email,
            admin_roles,
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
                                        this.props.openChangePasswordModal();
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

                                        this.setState({destroy_account_modal_visible: true});

                                    }}
                                >
                                    Delete Account
                                </Button>



                            </div>



                        </Card>

                    </div>

                    {this.changePasswordModal()}

                    {this.destroyAccountModal()}

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
        last_sign_in_ip,
        change_password_modal_visible,
        changing_password,
        password_success_message,
        password_error_message
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
        last_sign_in_ip,
        change_password_modal_visible,
        changing_password,
        password_success_message,
        password_error_message
    };
};

export default connect(mapStateToProps, {
    viewAdminAccount,
    clearViewAdminAccountState,
    changeAdminAccountPassword,
    openChangePasswordModal,
    closeChangePasswordModal,
    destroyAdminAccount
})(ViewAdminAccount);
