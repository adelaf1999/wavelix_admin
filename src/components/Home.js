import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    logoutAdmin,
    initializeHomePage,
    changeMyEmail,
    openCredentialModal,
    closeCredentialModal,
    changeMyPassword,
    clearHomeState
} from "../actions";
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {  Spinner, Image, Card, Row, Col ,  Button, Form, Modal, Alert} from "react-bootstrap";
import _ from "lodash";

class Home extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const credential_modal_mode = null; // { 0: email, 1: password }

        const credential = "";

        this.state = {
            history,
            credential_modal_mode,
            credential
        };

    }

    componentWillUnmount(){
        this.props.clearHomeState();
    }

    componentDidMount(){

        const {
            logged_in,
            initializeHomePage,
            access_token,
            client,
            uid
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            initializeHomePage(access_token, client, uid, history);

        }

    }


    getRoles(){

        const { roles } = this.props;

        let text = "";

        for(let i = 0; i < roles.length; i++){

            const role = roles[i];

            if(i === 0){

                text += _.startCase( role.split("_").join(" ") );

            }else{

                text += ( ", " + _.startCase( role.split("_").join(" ")  ) );

            }

        }

        return text;

    }


    exitCredentialModal(){

        const { closeCredentialModal } = this.props;

        closeCredentialModal();

        this.setState({credential_modal_mode: null, credential: ''});

    }


    credentialError(){

        const { credential_error } = this.props;

        if(credential_error.length > 0){

            return(

                <Alert variant="danger">
                    {credential_error}
                </Alert>

            );

        }

    }


    changingCredentialSpinner(){

        const { changing_credential } = this.props;

        if(changing_credential){

            return(

                <div className="spinner-container">

                    <Spinner animation="border" variant="primary" />

                </div>


            );

        }


    }


    credentialModal(){

        const {
            credential_modal_visible,
            access_token,
            client,
            uid,
            changeMyEmail,
            changeMyPassword
        } = this.props;


        const { history, credential_modal_mode, credential } = this.state;

        if(credential_modal_visible && credential_modal_mode !== null){

            return(

                <Modal
                    show={credential_modal_visible}
                    onHide={() => {
                        this.exitCredentialModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Change {credential_modal_mode === 0 ? 'Email' : 'Password'}</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>


                        <Form.Group controlId="formPlaintextCredential">

                            <Form.Label>
                                {credential_modal_mode === 0 ? 'Email' : 'Password ( at least 8 characters long )'}
                            </Form.Label>

                            <Form.Control
                                type={credential_modal_mode === 0 ? 'email' : 'password'}
                                placeholder={credential_modal_mode === 0 ? 'email' : 'password'}
                                onChange={(e) => {
                                    this.setState({credential: e.target.value});
                                }}
                            />

                        </Form.Group>

                        {this.changingCredentialSpinner()}

                        {this.credentialError()}



                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                this.exitCredentialModal();
                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant="primary"
                            onClick={(e) => {

                                e.preventDefault();

                                if(credential_modal_mode === 0){

                                    changeMyEmail(credential, access_token, client, uid, history);

                                }else{

                                    changeMyPassword(credential, access_token, client, uid, history);

                                }

                            }}
                        >
                            Submit
                        </Button>

                    </Modal.Footer>


                </Modal>


            );

        }


    }


    show() {

        const {
            initializing_page,
            profile_photo,
            name,
            email
        } = this.props;

        if (initializing_page) {

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


                        <Image className="profile-photo" src={profile_photo} rounded />


                    </div>


                    <div className="account-container">


                        <Card className="text-center account-card-container">

                            <Card.Header className="account-tile">
                                Account Information
                            </Card.Header>



                            <Card.Body>


                                <Form>


                                    <Form.Group as={Row} controlId="formPlaintextName">

                                        <Form.Label column sm="2">
                                            Name
                                        </Form.Label>

                                        <Col sm="10">
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={name}
                                            />
                                        </Col>

                                    </Form.Group>


                                    <Form.Group as={Row} controlId="formPlaintextEmail">

                                        <Form.Label column sm="2">
                                            Email
                                        </Form.Label>

                                        <Col sm="10">

                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={email}
                                            />

                                        </Col>

                                    </Form.Group>


                                    <Form.Group as={Row} controlId="formPlaintextRoles">

                                        <Form.Label column sm="2">
                                            Roles
                                        </Form.Label>

                                        <Col sm="10">

                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value={this.getRoles()}
                                            />

                                        </Col>

                                    </Form.Group>


                                </Form>




                            </Card.Body>




                            <Card.Footer className="footer-buttons-container" >

                                <Button
                                    variant="outline-primary"
                                    className="footer-button"
                                    onClick={(e) => {

                                        e.preventDefault();

                                        this.props.openCredentialModal();

                                        this.setState({credential_modal_mode: 0});


                                    }}
                                >
                                    Change email
                                </Button>


                                <Button
                                    variant="outline-primary"
                                    className="footer-button"
                                    onClick={(e) => {

                                        e.preventDefault();

                                        this.props.openCredentialModal();

                                        this.setState({credential_modal_mode: 1});

                                    }}
                                >
                                    Change password
                                </Button>



                            </Card.Footer>



                        </Card>



                    </div>



                    {this.credentialModal()}


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
        profile_photo,
        name,
        email,
        changing_credential,
        credential_error,
        credential_modal_visible
    } = state.home;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        profile_photo,
        name,
        email,
        changing_credential,
        credential_error,
        credential_modal_visible
    };


};


export default connect(mapStateToProps, {
    logoutAdmin,
    initializeHomePage,
    changeMyEmail,
    openCredentialModal,
    closeCredentialModal,
    changeMyPassword,
    clearHomeState
})(Home)