import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getCustomerData,
    clearViewCustomerAccountState
} from "../actions";
import _ from "lodash";
import {  Spinner, Card,  Button, Form, Modal} from "react-bootstrap";

class ViewCustomerAccount extends  Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        this.state = {
            history,
            params
        };

    }

    componentWillUnmount(){

        this.props.clearViewCustomerAccountState();

    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            getCustomerData
        } = this.props;

        const { history, params } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            const customer_user_id = params.customer_user_id;

            getCustomerData(customer_user_id, access_token, client, uid, history);


        }

    }


    show(){

        const {
            initializing_page,
            full_name,
            email,
            username,
            building_name,
            apartment_floor,
            country,
            phone_number,
            current_sign_in_ip,
            last_sign_in_ip,
            profile_link
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

                    <div id="view-customer-account-container">

                        <div id="view-customer-profile-container">

                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(profile_link, "_blank")
                                }}
                            >
                                View Profile
                            </Button>

                        </div>

                        <Card id="view-customer-account-card">



                            <Card.Body>

                                <Form>

                                    <Form.Group  >

                                        <Form.Label >
                                            Full Name
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={full_name}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Email
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={email}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Username
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={username}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Building Name
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={building_name}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Apartment Floor
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={apartment_floor}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Country
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={country}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Phone Number
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={phone_number}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Current Sign In Ip
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={current_sign_in_ip}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Last Sign In Ip
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={last_sign_in_ip}
                                        />

                                    </Form.Group>




                                </Form>

                            </Card.Body>

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
        logged_in
    } = state.login;

    const {
        initializing_page,
        full_name,
        email,
        username,
        building_name,
        apartment_floor,
        country,
        phone_number,
        current_sign_in_ip,
        last_sign_in_ip,
        profile_link
    } = state.view_customer_account;

    return {
        access_token,
        client,
        uid,
        logged_in,
        initializing_page,
        full_name,
        email,
        username,
        building_name,
        apartment_floor,
        country,
        phone_number,
        current_sign_in_ip,
        last_sign_in_ip,
        profile_link
    };
};

export default connect(mapStateToProps, {
    getCustomerData,
    clearViewCustomerAccountState
})(ViewCustomerAccount);
