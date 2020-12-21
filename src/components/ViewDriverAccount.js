import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getDriverData,
    clearViewDriverAccountState,
    driverAccountReviewersChanged,
    driverAccountAdminsDeclinedChanged,
    driverAccountReviewStatusChanged,
    driverAccountUnverifiedReasonsChanged,
    driverAccountDriverVerifiedChanged,
    driverAccountVerifiedByChanged
} from "../actions";
import {  Spinner, Image, Card,  Button, Form, Modal, Alert, Accordion, ListGroup} from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";

class ViewDriverAccount extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const driver_account_channel_subscription = null;

        this.state = {
            history,
            params,
            cable,
            driver_account_channel_subscription
        };

    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const driver_account_channel_subscription = this.state.driver_account_channel_subscription;

        if(driver_account_channel_subscription !== null){

            cable.subscriptions.remove(driver_account_channel_subscription);

        }

        this.props.clearViewDriverAccountState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            getDriverData,
            driverAccountReviewersChanged,
            driverAccountAdminsDeclinedChanged,
            driverAccountReviewStatusChanged,
            driverAccountUnverifiedReasonsChanged,
            driverAccountDriverVerifiedChanged,
            driverAccountVerifiedByChanged
        } = this.props;

        const { history, params } = this.state;

        if(!logged_in){

            history.push("/");

        }else{

            const driver_id = params.driver_id;

            getDriverData(driver_id, access_token, client, uid, history);

            const cable = this.state.cable;

            let driver_account_channel_subscription = this.state.driver_account_channel_subscription;

            if(driver_account_channel_subscription === null){

                driver_account_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'DriverAccountChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        driver_id: driver_id
                    },
                    {
                        connected: () => {

                            console.log('DriverAccountChannel Connected!');

                        },
                        received: (data) => {

                            console.log("DriverAccountChannel Received!");

                            console.log(data);

                            if(data.verified_by !== undefined){

                                const verified_by = data.verified_by;

                                console.log(verified_by);

                                driverAccountVerifiedByChanged(verified_by);


                            }

                            if(data.driver_verified !== undefined){

                                const driver_verified = data.driver_verified;

                                console.log(driver_verified);

                                driverAccountDriverVerifiedChanged(driver_verified);

                            }

                            if(data.unverified_reasons !== undefined){

                                const unverified_reasons = data.unverified_reasons;

                                console.log(unverified_reasons);

                                driverAccountUnverifiedReasonsChanged(unverified_reasons);

                            }

                            if(data.review_status !== undefined){

                                const review_status = data.review_status;

                                console.log(review_status);

                                driverAccountReviewStatusChanged(review_status);

                            }

                            if(data.admins_declined !== undefined){

                                const admins_declined = data.admins_declined;

                                console.log(admins_declined);

                                driverAccountAdminsDeclinedChanged(admins_declined);

                            }


                            if(data.current_reviewers !== undefined){

                                const current_reviewers = data.current_reviewers;

                                console.log(current_reviewers);

                                driverAccountReviewersChanged(current_reviewers);

                            }


                        }
                    }
                );

                this.setState({driver_account_channel_subscription: driver_account_channel_subscription});

            }

        }

    }


    renderVerifiedBy(){

        const {verified_by} = this.props;

        if(!_.isEmpty(verified_by)){

            return(

                <Form.Group>

                    <Form.Label >
                        Verified By
                    </Form.Label>


                    <Form.Control
                        readOnly
                        type="text"
                        value={verified_by}
                    />

                </Form.Group>

            );

        }

    }




    renderDocumentPictures(pictures){


        return _.map(pictures, (picture, index) => {
            return(

                <Button
                    key={index}
                    onClick={(e) => {
                        e.preventDefault();
                        window.open(picture, "_blank")
                    }}
                    variant="link"
                >
                    VIEW {`IMAGE-${index + 1}`}
                </Button>



            );
        })

    }

    currentReviewers(){

        const { current_reviewers } = this.props;

        if( current_reviewers.length > 0){

            return(

                <div >


                    <Form.Label className="driver-verification-label">
                        Currently Reviewing
                    </Form.Label>



                    <div >

                        {
                            _.map(current_reviewers, (reviewer, index) => {

                                return(

                                    <Button
                                        key={index}
                                        variant="outline-success"
                                        id="driver-reviewer-button"
                                    >
                                        {reviewer + " •" }
                                    </Button>

                                );

                            })
                        }

                    </div>




                </div>



            );


        }

    }

    driverVerificationCard(){

        const { roles } = this.props;

        if(roles.includes("root_admin") || roles.includes("account_manager")){

            return(

                <Card
                    className="view-driver-account-card"
                >

                    <Card.Header
                        as="h5"
                        className="view-driver-account-card-header"
                    >
                        Driver Verification Guidelines
                    </Card.Header>


                    <Card.Body id="driver-verification-card-body">

                        <Form>

                            {this.currentReviewers()}

                        </Form>

                    </Card.Body>


                </Card>

            );
        }

    }


    show(){

        const {
            initializing_page,
            profile_picture,
            name,
            email,
            phone_number,
            country,
            driver_verified,
            account_blocked,
            review_status,
            registered_at,
            latitude,
            longitude,
            driver_license_pictures,
            national_id_pictures,
            vehicle_registration_pictures
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

                        <Image className="profile-photo" src={profile_picture} thumbnail />

                    </div>


                    <div id="view-driver-account-container">

                        <Card className="view-driver-account-card">

                            <Card.Body>

                                <Form>

                                    <Form.Group>

                                        <Form.Label >
                                            Name
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={name}
                                        />

                                    </Form.Group>

                                    <Form.Group>

                                        <Form.Label >
                                            Phone Number
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={phone_number}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Email
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={email}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Country
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={country}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Verified
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={driver_verified ? 'Yes' : 'No'}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Account Blocked
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={account_blocked ? 'Yes' : 'No'}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Review Status
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(review_status)}
                                        />

                                    </Form.Group>

                                    <Form.Group>

                                        <Form.Label >
                                            Registered At
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={registered_at}
                                        />

                                    </Form.Group>

                                    {this.renderVerifiedBy()}

                                    <br/>

                                    <Accordion
                                        className="view-driver-documents-accordion"
                                        defaultActiveKey="0"
                                    >


                                        <Card>

                                            <Card.Header>

                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Driver License Pictures
                                                </Accordion.Toggle>

                                            </Card.Header>

                                            <Accordion.Collapse eventKey="0">

                                                <Card.Body>

                                                    <ListGroup>

                                                        {this.renderDocumentPictures(driver_license_pictures)}

                                                    </ListGroup>


                                                </Card.Body>

                                            </Accordion.Collapse>

                                        </Card>


                                    </Accordion>



                                    <Accordion
                                        className="view-driver-documents-accordion"
                                        defaultActiveKey="0"
                                    >


                                        <Card>

                                            <Card.Header>

                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    National ID Pictures
                                                </Accordion.Toggle>

                                            </Card.Header>

                                            <Accordion.Collapse eventKey="0">

                                                <Card.Body>

                                                    <ListGroup>

                                                        {this.renderDocumentPictures(national_id_pictures)}

                                                    </ListGroup>


                                                </Card.Body>

                                            </Accordion.Collapse>

                                        </Card>


                                    </Accordion>


                                    <Accordion
                                        className="view-driver-documents-accordion"
                                        defaultActiveKey="0"
                                    >


                                        <Card>

                                            <Card.Header>

                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Vehicle Registration Pictures
                                                </Accordion.Toggle>

                                            </Card.Header>

                                            <Accordion.Collapse eventKey="0">

                                                <Card.Body>

                                                    <ListGroup>

                                                        {this.renderDocumentPictures(vehicle_registration_pictures)}

                                                    </ListGroup>


                                                </Card.Body>

                                            </Accordion.Collapse>

                                        </Card>


                                    </Accordion>


                                    <Button
                                        variant="outline-primary"
                                        id="view-driver-location-button"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                                            window.open(url, "_blank")

                                        }}
                                    >
                                        View Last Available Location
                                    </Button>



                                </Form>

                            </Card.Body>

                        </Card>

                        {this.driverVerificationCard()}

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
        roles,
        id
    } = state.login;

    const {
        initializing_page,
        profile_picture,
        name,
        phone_number,
        country,
        driver_verified,
        account_blocked,
        review_status,
        registered_at,
        latitude,
        longitude,
        driver_license_pictures,
        national_id_pictures,
        vehicle_registration_pictures,
        verified_by,
        admins_declined,
        unverified_reasons,
        email,
        current_reviewers
    } = state.view_driver_account;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
        initializing_page,
        profile_picture,
        name,
        phone_number,
        country,
        driver_verified,
        account_blocked,
        review_status,
        registered_at,
        latitude,
        longitude,
        driver_license_pictures,
        national_id_pictures,
        vehicle_registration_pictures,
        verified_by,
        admins_declined,
        unverified_reasons,
        email,
        current_reviewers
    };

};


export default connect(mapStateToProps, {
    getDriverData,
    clearViewDriverAccountState,
    driverAccountReviewersChanged,
    driverAccountAdminsDeclinedChanged,
    driverAccountReviewStatusChanged,
    driverAccountUnverifiedReasonsChanged,
    driverAccountDriverVerifiedChanged,
    driverAccountVerifiedByChanged
})(ViewDriverAccount);
