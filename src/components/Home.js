import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    logoutAdmin,
    initializeHomePage
} from "../actions";
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {  Spinner, Image, Card, Row, Col ,  Button, Form} from "react-bootstrap";
import _ from "lodash";

class Home extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = {
            history
        };

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


                        <Image className="profile-photo" src={profile_photo} roundedCircle />


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
                                            <Form.Control plaintext readOnly defaultValue={name} />
                                        </Col>

                                    </Form.Group>


                                    <Form.Group as={Row} controlId="formPlaintextEmail">

                                        <Form.Label column sm="2">
                                            Email
                                        </Form.Label>

                                        <Col sm="10">
                                            <Form.Control plaintext readOnly defaultValue={email} />
                                        </Col>

                                    </Form.Group>


                                    <Form.Group as={Row} controlId="formPlaintextRoles">

                                        <Form.Label column sm="2">
                                           Roles
                                        </Form.Label>

                                        <Col sm="10">
                                            <Form.Control plaintext readOnly defaultValue={this.getRoles()} />
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

                                    }}
                                >
                                    Change password
                                </Button>

                                <Button
                                    variant="outline-primary"
                                    className="footer-button"
                                    onClick={(e) => {
                                        e.preventDefault();

                                    }}
                                >
                                    Change Email
                                </Button>

                            </Card.Footer>



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
        email
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
        email
    };


};


export default connect(mapStateToProps, {
    logoutAdmin,
    initializeHomePage
})(Home)