import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button,  Alert, Spinner, Modal } from "react-bootstrap";
import {
    checkEmail,
    loginAdmin,
    loginPageChanged,
    resendUnlockLink,
    resendVerificationCode,
    closeEmailModal
} from "../actions";
import _ from "lodash";

class Login extends Component {

    constructor(props) {

        super(props);

        const history = props.history;

        const email = "";

        const password = "";

        const verification_code = "";

        const password_invalid = false;

        const verification_code_invalid = false;

        const email_invalid = false;

        this.state = {
            history,
            email,
            password,
            verification_code,
            password_invalid,
            verification_code_invalid,
            email_invalid
        };

    }


    componentDidMount(){

        const { logged_in } = this.props;

        const {  history } = this.state;

        if(logged_in){

            history.push("/home");

        }


    }

    checkEmailButton(){

        const { loading } = this.props;


        if(loading){

            return(

                <Button variant="success" className="submit-button" disabled>

                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />


                </Button>

            );


        }else{

            return(

                <Button
                    variant="success"
                    className="submit-button"
                    onClick={(e) => {

                        e.preventDefault();

                        const { email } = this.state;

                        const { checkEmail } = this.props;

                        this.setState({email_invalid: false});

                        if(_.isEmpty(email)){

                            this.setState({email_invalid: true});

                        }else{

                            checkEmail(email);

                        }


                    }}
                >
                    CONTINUE
                </Button>

            );

        }

    }

    emailError(){

        const { email_error } = this.props;

        if(email_error.length > 0){

            return(

                <Alert variant="danger">
                    {email_error}
                </Alert>

            );

        }

    }

    loginButton(){

        const { loading } = this.props;


        if(loading){

            return(

                <Button variant="success" className="submit-button" disabled>

                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />


                </Button>

            );


        }else{

            return(

                <Button
                    variant="success"
                    className="submit-button"
                    onClick={(e) => {

                        e.preventDefault();

                        this.setState({password_invalid: false, verification_code_invalid: false});

                        const { email, password, verification_code, history } = this.state;


                        let is_valid = true;

                        if(_.isEmpty(password)){

                            is_valid = false;

                            this.setState({password_invalid: true});

                        }

                        if(_.isEmpty(verification_code)){

                            is_valid = false;

                            this.setState({verification_code_invalid: true});

                        }

                        if(is_valid){

                            this.props.loginAdmin(email, password, verification_code, history);

                        }



                    }}
                >
                    LOGIN
                </Button>

            );

        }


    }

    loginError(){

        const {  login_errors } = this.props;


        return _.map(login_errors, (error, index) => {

            return(

                <Alert variant="danger" key={index}>
                    {error}
                </Alert>


            );

        })

    }


    resendEmailButtons(){


        const { email, resending_email } = this.state;

        const { resendVerificationCode, resendUnlockLink  } = this.props;

        if(resending_email){

            return(

                <div className="spinner-container">

                    <Spinner animation="border" variant="primary" />

                </div>
            )

        }else{

            return(

                <div className="buttons-container">

                    <Button
                        variant="outline-secondary"
                        className="button-link-width"
                        onClick={(e) => {
                            e.preventDefault();
                            resendVerificationCode(email);
                        }}
                    >
                        Resend Verification Code
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="button-link-width"
                        onClick={(e) => {
                            e.preventDefault();
                            resendUnlockLink(email);
                        }}
                    >
                        Resend Account Unlock Link
                    </Button>

                </div>

            );

        }

    }



    emailModal(){

        const { email_modal_visible, closeEmailModal } = this.props;


        if(email_modal_visible){

            return(

                <Modal
                    show={email_modal_visible}
                    onHide={() => {
                        closeEmailModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Successfully sent email</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>Please check your email inbox and spam folder</Modal.Body>

                    <Modal.Footer>


                        <Button variant="primary" onClick={() => {
                            closeEmailModal();
                        }}>
                            Close
                        </Button>

                    </Modal.Footer>


                </Modal>

            );

        }



    }

    renderScreen(){

        const { current_page } = this.props;

        if(current_page === 1){

            return(

                <div>

                    <h1 className="title">Wavelix Admin Portal</h1>

                    <Form onSubmit={(e) => e.preventDefault()} >

                        <Form.Group controlId="formBasicEmail" className="input-container">

                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={this.state.email}
                                onChange={(e) => {
                                    this.setState({email: e.target.value});
                                }}
                                isInvalid={this.state.email_invalid}
                            />

                            <Form.Control.Feedback type="invalid">
                                email is invalid
                            </Form.Control.Feedback>

                        </Form.Group>

                        {this.emailError()}

                        {this.checkEmailButton()}


                    </Form>

                </div>

            );

        }else{

            return(

                <div>

                    <p className="notice-text">
                        Enter the verification code sent to {this.state.email}. If you forgot your password,
                        please contact the administrator.
                    </p>


                    <Form onSubmit={(e) => e.preventDefault()} >


                        <Form.Group controlId="formBasicPassword" className="input-container">

                            <Form.Label>Password</Form.Label>

                            <Form.Control
                                type="password"
                                placeholder="password"
                                value={this.state.password}
                                onChange={(e) => {
                                    this.setState({password: e.target.value});
                                }}
                                isInvalid={this.state.password_invalid}
                            />

                            <Form.Control.Feedback type="invalid">
                                password is invalid
                            </Form.Control.Feedback>

                        </Form.Group>


                        <Form.Group className="input-container">

                            <Form.Label>Verification Code</Form.Label>

                            <Form.Control
                                placeholder="code"
                                value={this.state.verification_code}
                                onChange={(e) => {
                                    this.setState({verification_code: e.target.value});
                                }}
                                isInvalid={this.state.verification_code_invalid}
                            />

                            <Form.Control.Feedback type="invalid">
                                code is invalid
                            </Form.Control.Feedback>

                        </Form.Group>


                        {this.loginError()}

                        {this.loginButton()}


                        <Button
                            variant="primary"
                            className="submit-button"
                            onClick={(e) => {

                                e.preventDefault();

                                this.setState({
                                    email: '',
                                    password: '',
                                    verification_code: '',
                                    password_invalid: false,
                                    verification_code_invalid: false,
                                    email_invalid: false
                                });


                                this.props.loginPageChanged(1);

                            }}
                        >
                            BACK
                        </Button>


                        {this.resendEmailButtons()}

                        {this.emailModal()}


                    </Form>

                </div>

            );

        }

    }

    render(){


        return(

            <div className="center-container form-container" >

                {this.renderScreen()}

            </div>

        );

    }

}

const mapStateToProps = (state) => {

    const {
        current_page,
        loading,
        email_error,
        login_errors,
        logged_in,
        resending_email,
        email_modal_visible
    } = state.login;


    return {
        current_page,
        loading,
        email_error,
        login_errors,
        logged_in,
        resending_email,
        email_modal_visible
    };
};


export default connect(mapStateToProps, {
    checkEmail,
    loginAdmin,
    loginPageChanged,
    resendUnlockLink,
    resendVerificationCode,
    closeEmailModal
})(Login)