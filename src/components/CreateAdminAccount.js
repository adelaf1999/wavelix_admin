import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import _ from "lodash";
import {  Spinner, Form, Button, Alert, Modal} from "react-bootstrap";
import {
    initializeNewAdminAccount,
    clearCreateAdminAccountState,
    createAdminAccount,
    closeCreateAdminSuccessModal
} from "../actions";

class CreateAdminAccount extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const email = "";

        const password = "";

        const full_name = "";

        const profile_photo = null;

        const selected_roles = [];

        this.state = {
            history,
            email,
            password,
            full_name,
            profile_photo,
            selected_roles
        };

    }

    componentWillUnmount(){
        this.props.clearCreateAdminAccountState();
    }

    componentDidMount(){

        const {
            logged_in,
            roles,
            initializeNewAdminAccount,
            access_token,
            client,
            uid
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin")  ){

            history.push("/home");

        }else{

            initializeNewAdminAccount(access_token, client, uid, history);

        }


    }

    getRoles(){

        const { available_roles } = this.props;

        const { selected_roles } = this.state;

        return _.map(available_roles, (role, index) => {

            return(

                <Form.Check
                    type="checkbox"
                    label={_.startCase( role.split("_").join(" ") )}
                    key={index}
                    checked={selected_roles.includes(role)}
                    onChange={(e) => {

                        const checked = e.target.checked;

                        if(checked){

                            let new_selected_roles = selected_roles;

                            new_selected_roles.push(role);

                            this.setState({selected_roles: new_selected_roles});

                        }else{

                            let new_selected_roles = selected_roles;

                            _.remove(new_selected_roles, function(selected_role) {
                                return role === selected_role;
                            });


                            this.setState({selected_roles: new_selected_roles});

                        }

                    }}
                />

            );

        })

    }



    profilePhotoError(){

        const { profile_photo_error } = this.props;

        if(profile_photo_error.length > 0){

            return(

                <Alert variant="danger" className="create-admin-error">
                    {profile_photo_error}
                </Alert>

            );

        }

    }

    rolesError(){

        const { roles_error } = this.props;

        if(roles_error.length > 0){

            return(

                <Alert variant="danger" className="create-admin-error">
                    {roles_error}
                </Alert>

            );

        }


    }


    createError(){

        const {  create_error } = this.props;

        if(create_error.length > 0){

            return(

                <Alert variant="danger" className="create-admin-error">
                    {create_error}
                </Alert>

            );

        }

    }

    exitCreateSuccessModal(){

        this.props.closeCreateAdminSuccessModal();

        this.setState({
            email: '',
            password: '',
            full_name: '',
            profile_photo: null,
            selected_roles: []
        });

    }

    createSuccessModal(){

        const { create_success_modal_visible  } = this.props;

        if(create_success_modal_visible){

            return(

                <Modal
                    show={create_success_modal_visible}
                    onHide={() => {
                       this.exitCreateSuccessModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Successfully Created account</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p>You can now close this window.</p>

                    </Modal.Body>

                    <Modal.Footer>


                        <Button variant="primary" onClick={() => {
                            this.exitCreateSuccessModal();
                        }}>
                            Close
                        </Button>

                    </Modal.Footer>


                </Modal>

            );

        }

    }

    show(){


        const {
            initializing_page,
            email_invalid,
            email_error,
            password_invalid,
            password_error,
            full_name_invalid,
            full_name_error,
            createAdminAccount,
            creating_account,
            access_token,
            client,
            uid,
        } = this.props;

        if(initializing_page || creating_account){

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

                    <h4 id="create-admin-account-title">
                        Create Admin Account
                    </h4>


                    <div id="create-admin-container">

                        <Form id="create-admin-account-form">

                            <Form.Group className="create-admin-account-field" >

                                <Form.Label>Email</Form.Label>

                                <Form.Control
                                    type="email"
                                    value={this.state.email}
                                    onChange={(e) => {
                                        this.setState({email: e.target.value});
                                    }}
                                    isInvalid={email_invalid}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {email_error}
                                </Form.Control.Feedback>

                            </Form.Group>

                            <Form.Group className="create-admin-account-field"  >

                                <Form.Label>Password (at least 8 characters long)</Form.Label>

                                <Form.Control
                                    type="password"
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.setState({password: e.target.value});
                                    }}
                                    isInvalid={password_invalid}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {password_error}
                                </Form.Control.Feedback>


                            </Form.Group>


                            <Form.Group className="create-admin-account-field" >

                                <Form.Label>Full Name</Form.Label>

                                <Form.Control
                                    value={this.state.full_name}
                                    onChange={(e) => {
                                        this.setState({full_name: e.target.value});
                                    }}
                                    isInvalid={full_name_invalid}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {full_name_error}
                                </Form.Control.Feedback>


                            </Form.Group>


                            <Form.Group className="create-admin-account-field" >

                                <Form.File
                                    label="Profile Photo (*.jpg, *.jpeg, *.png, *.gif)"
                                    accept="image/jpeg,image/gif,image/png"
                                    onChange={(e) => {

                                        const file = e.target.files[0];

                                        const valid_file_types = ["image/jpeg","image/gif", "image/png"];

                                        if(valid_file_types.includes(file.type)) {

                                            this.setState({profile_photo: file });

                                        }else{

                                            this.setState({profile_photo: null});

                                        }

                                    }}
                                />

                                {this.profilePhotoError()}



                            </Form.Group>


                            <Form.Group className="create-admin-account-field" >

                                <Form.Label>Roles (select at least one)</Form.Label>

                                {this.getRoles()}

                                {this.rolesError()}

                            </Form.Group>


                            <p style={{
                                fontSize: 18
                            }}>
                                Guidelines
                            </p>


                            <Alert variant="info">
                                1) Make sure the profile photo is in focus, well lit, and the face is shown clearly and their is no other subject in the frame.
                            </Alert>


                            <Alert variant="info">
                                2) Make sure the full name matches the name in the passport, driver's license or national ID.
                            </Alert>

                            <Alert variant="info">
                                3) Request the owner of the new admin account to protect their email with 2 factor authentication with their phone number.
                            </Alert>


                            {this.createError()}


                            <Button
                                variant="success"
                                id="create-admin-account-submit"
                                onClick={(e) => {

                                    e.preventDefault();

                                    const { email, password, full_name, profile_photo, selected_roles, history} = this.state;

                                    createAdminAccount( email, password, full_name, profile_photo, selected_roles, access_token, client, uid, history );


                                }}
                            >
                                SUBMIT
                            </Button>



                        </Form>


                        {this.createSuccessModal()}

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
        available_roles,
        email_invalid,
        email_error,
        password_invalid,
        password_error,
        full_name_invalid,
        full_name_error,
        profile_photo_error,
        roles_error,
        create_error,
        creating_account,
        create_success_modal_visible
    } = state.create_admin_account;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        available_roles,
        email_invalid,
        email_error,
        password_invalid,
        password_error,
        full_name_invalid,
        full_name_error,
        profile_photo_error,
        roles_error,
        create_error,
        creating_account,
        create_success_modal_visible
    };
};

export default connect(mapStateToProps, {
    initializeNewAdminAccount,
    clearCreateAdminAccountState,
    createAdminAccount,
    closeCreateAdminSuccessModal
})(CreateAdminAccount);