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
    driverAccountVerifiedByChanged,
    declineDriverVerification
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

        const decline_verification_modal_visible = false;

        const declined_reason = "";

        this.state = {
            history,
            params,
            cable,
            driver_account_channel_subscription,
            decline_verification_modal_visible,
            declined_reason
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

    acceptVerificationButton(){

        const { driver_verified } = this.props;

        if(!driver_verified){

            return(

                <Button
                    variant="outline-success"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="driver-verification-button"
                >
                    Accept Verification
                </Button>

            );

        }

    }

    declineVerificationButton(){

        const { driver_verified, admins_declined, id } = this.props;

        if(!driver_verified && !admins_declined.includes(id)){

            return(

                <Button
                    variant="outline-danger"
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({decline_verification_modal_visible: true});
                    }}
                    className="driver-verification-button"
                >
                    Decline Verification
                </Button>

            );

        }

    }

    unverifiedReasons(){

        const { unverified_reasons } = this.props;

        if(unverified_reasons.length > 0){

            return(

                <div>


                    <Form.Label className="driver-verification-label">
                        Reviewers Declined Reasons
                    </Form.Label>


                    {
                        _.map(unverified_reasons, (unverified_reason, index) => {

                            return(

                                <Card
                                    key={index}
                                    className="driver-unverified-reason-card"
                                >

                                    <Card.Header>{_.startCase(unverified_reason.admin_name)}</Card.Header>

                                    <Card.Body>

                                        <Card.Text>
                                            {unverified_reason.reason}
                                        </Card.Text>

                                    </Card.Body>

                                </Card>

                            );

                        })
                    }


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

                            <div>

                                <Form.Label className="store-verification-label">
                                    Guidelines
                                </Form.Label>

                                <Alert
                                    variant="warning"
                                    className="driver-verification-instructions"
                                >
                                    Please do all of the following tasks to verify and validate the driver's information
                                    and documents. If all information is correct and the driver's documents are valid, click on
                                    the accept verification button. Else, click on the decline verification button and enter the
                                    reason for declining verification.
                                </Alert>


                                <Alert variant="primary" className="driver-verification-process">
                                    Profile Photo Validation
                                </Alert>

                                <ListGroup className="driver-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="driver-verification-guidelines"
                                    >
                                        Make sure the profile photo is forward-facing, centered and includes the driver's
                                        full face with no sunglasses. No other subject should be in the frame, and it should
                                        be well-lit and in focus.
                                    </ListGroup.Item>


                                </ListGroup>


                                <Alert variant="primary" className="driver-verification-process">
                                    Driver's License Validation
                                </Alert>


                                <ListGroup className="driver-verification-guidelines-container">


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the driver's license is certified and signed by a sworn translator,
                                        a notary public or other relevant government authority.
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the photo in the driver's license matches the profile photo (i.e. same person).
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the name in the driver's license matches the name of the driver.
                                    </ListGroup.Item>


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the driver's license is not expired.
                                    </ListGroup.Item>

                                </ListGroup>


                                <Alert variant="primary" className="driver-verification-process">
                                    National ID Validation
                                </Alert>



                                <ListGroup className="driver-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the National ID is certified and signed by a sworn translator,
                                        a notary public or other relevant government authority.
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the photo in the National ID matches the profile photo (i.e. same person).
                                    </ListGroup.Item>


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the name in the National ID matches the name of the driver.
                                    </ListGroup.Item>



                                </ListGroup>


                                <Alert variant="primary" className="driver-verification-process">
                                    Vehicle Registration Document Validation
                                </Alert>


                                <ListGroup className="driver-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the Vehicle Registration Document is certified and signed by a sworn translator,
                                        a notary public or other relevant government authority.
                                    </ListGroup.Item>


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the driver's name is included in the vehicle registration document (i.e. the
                                        driver owns the vehicle).
                                    </ListGroup.Item>

                                </ListGroup>


                                {this.acceptVerificationButton()}

                                {this.declineVerificationButton()}

                                {this.unverifiedReasons()}


                            </div>

                        </Form>

                    </Card.Body>


                </Card>

            );
        }

    }

    exitDeclineVerificationModal(){

        this.setState({decline_verification_modal_visible: false, declined_reason: ''});

    }

    declineVerificationModalButton(){

        const { declined_reason, params, history } = this.state;

        const driver_id = params.driver_id;

        if(_.isEmpty(declined_reason)){

            return(

                <Button
                    disabled
                    variant="danger"
                >
                    Decline
                </Button>

            );

        }else{

            return(

                <Button
                    variant="danger"
                    onClick={(e) => {

                        e.preventDefault();

                        const {
                            access_token,
                            client,
                            uid,
                            declineDriverVerification
                        } = this.props;

                        declineDriverVerification(
                            driver_id,
                            declined_reason,
                            access_token,
                            client,
                            uid,
                            history
                        );

                        this.exitDeclineVerificationModal();

                    }}
                >
                    Decline
                </Button>

            );

        }


    }


    declineVerificationModal(){

        const { decline_verification_modal_visible} = this.state;


        if(decline_verification_modal_visible){

            return(

                <Modal
                    show={decline_verification_modal_visible}
                    onHide={() => {
                        this.exitDeclineVerificationModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Decline Verification</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group controlId="formPlaintextCredential">

                            <Form.Label>
                                Please enter the reason(s) for declining verification
                            </Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) => {
                                    this.setState({declined_reason: e.target.value});
                                }}
                            />

                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitDeclineVerificationModal();

                            }}
                        >
                            Close
                        </Button>


                        {this.declineVerificationModalButton()}

                    </Modal.Footer>


                </Modal>


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

                    {this.declineVerificationModal()}

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
    driverAccountVerifiedByChanged,
    declineDriverVerification
})(ViewDriverAccount);
