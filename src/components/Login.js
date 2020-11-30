import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button,  Alert, Spinner } from "react-bootstrap";
import {  checkEmail } from "../actions";

class Login extends Component {

    constructor(props) {

        super(props);

        const email = "";

        this.state = {
            email
        };

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
                        this.props.checkEmail(this.state.email);
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

    renderScreen(){

        const { current_page } = this.props;

        if(current_page === 1 ){

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
                            />

                        </Form.Group>

                        {this.emailError()}

                        {this.checkEmailButton()}


                    </Form>

                </div>

            );

        }else{

            return(

                <div>

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
        email_error
    } = state.login;


    return {
        current_page,
        loading,
        email_error
    };
};


export default connect(mapStateToProps, {
    checkEmail
})(Login)