import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getStoreData,
    clearViewStoreAccountState,
    storeAccountReviewersChanged,
    storeAccountStatusChanged,
    storeAccountReviewStatusChanged,
    storeAccountVerifiedByChanged,
    storeAccountAdminsDeclinedChanged,
    storeAccountUnverifiedReasonsChanged,
    acceptStoreVerification,
    declineStoreVerification
} from "../actions";
import _ from "lodash";
import {  Spinner, Card,  Button, Form, Modal, Alert, ListGroup} from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class ViewStoreAccount extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const store_account_channel_subscription = null;

        const business_license_modal_visible = false;

        const accept_verification_modal_visible = false;

        const decline_verification_modal_visible = false;

        const declined_reason = "";

        this.state = {
            history,
            params,
            cable,
            store_account_channel_subscription,
            business_license_modal_visible,
            accept_verification_modal_visible,
            decline_verification_modal_visible,
            declined_reason
        };
    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const store_account_channel_subscription = this.state.store_account_channel_subscription;

        if(store_account_channel_subscription !== null){

            cable.subscriptions.remove(store_account_channel_subscription);

        }

        this.props.clearViewStoreAccountState();

    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            getStoreData,
            storeAccountReviewersChanged,
            storeAccountStatusChanged,
            storeAccountReviewStatusChanged,
            storeAccountVerifiedByChanged,
            storeAccountAdminsDeclinedChanged,
            storeAccountUnverifiedReasonsChanged
        } = this.props;

        const { history, params } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            const store_user_id = params.store_user_id;

            getStoreData(store_user_id, access_token, client, uid, history);

            const cable = this.state.cable;

            let store_account_channel_subscription = this.state.store_account_channel_subscription;

            if(store_account_channel_subscription === null){

                store_account_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'StoreAccountChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        store_user_id: store_user_id
                    },
                    {
                        connected: () => {

                            console.log('StoreAccountChannel Connected!');

                        },
                        received: (data) => {

                            console.log("StoreAccountChannel Received!");

                            console.log(data);


                            if(data.status !== undefined){

                                const account_status = data.status;

                                console.log(account_status);

                                storeAccountStatusChanged(account_status);

                            }


                            if(data.review_status !== undefined){

                                const review_status = data.review_status;

                                console.log(review_status);

                                storeAccountReviewStatusChanged(review_status);

                            }

                            if(data.verified_by !== undefined){

                                const verified_by = data.verified_by;

                                console.log(verified_by);

                                storeAccountVerifiedByChanged(verified_by);


                            }


                            if(data.current_reviewers !== undefined){

                                const current_reviewers = data.current_reviewers;

                                console.log(current_reviewers);

                                storeAccountReviewersChanged(current_reviewers);

                            }


                            if(data.admins_declined !== undefined){

                                const admins_declined = data.admins_declined;

                                console.log(admins_declined);

                                storeAccountAdminsDeclinedChanged(admins_declined);

                            }

                            if(data.unverified_reasons !== undefined){

                                const unverified_reasons = data.unverified_reasons;

                                console.log(unverified_reasons);

                                storeAccountUnverifiedReasonsChanged(unverified_reasons);

                            }


                        }
                    }
                );

                this.setState({store_account_channel_subscription: store_account_channel_subscription});

            }


        }

    }

    verifiedBy(){

        const {verified_by, status } = this.props;

        if(!_.isEmpty(verified_by)){

            return(

                <Form.Group  >

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

    exitBusinessLicenseModal(){
        this.setState({business_license_modal_visible: false});
    }

    businessLicenseModal(){

        const { business_license_modal_visible } = this.state;

        if(business_license_modal_visible){

            return(

                <Modal
                    show={business_license_modal_visible}
                    onHide={() => {
                        this.exitBusinessLicenseModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Business License Guidelines</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>
                        Please make sure NOT to open the document on your computer if possible,
                        in case the document uploaded had a virus. It is recommended to view the document
                        on https://onlinedocumentviewer.com/Viewer/ or Google Docs.
                    </Modal.Body>

                    <Modal.Footer>


                        <Button variant="primary" onClick={() => {
                            this.exitBusinessLicenseModal();
                        }}>
                            Close
                        </Button>

                    </Modal.Footer>


                </Modal>

            );

        }

    }


    currentReviewers(){


        const { current_reviewers } = this.props;

        if( current_reviewers.length > 0){

            return(

                <div >


                    <Form.Label className="store-verification-label">
                        Currently Reviewing
                    </Form.Label>



                    <div >

                        {
                            _.map(current_reviewers, (reviewer, index) => {

                                return(

                                    <Button
                                        key={index}
                                        variant="outline-success"
                                        id="store-reviewer-button"
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

    unverifiedReasons(){

        const { unverified_reasons } = this.props;

        if(unverified_reasons.length > 0){

            return(

                <div>


                    <Form.Label className="store-verification-label">
                        Reviewers Declined Reasons
                    </Form.Label>


                    {
                        _.map(unverified_reasons, (unverified_reason, index) => {

                            return(

                                <Card
                                    key={index}
                                    className="store-unverified-reason-card"
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

    acceptVerificationButton(){

        const { status } = this.props;

        if(status !== "verified"){

            return(

                <Button
                    variant="outline-success"
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({accept_verification_modal_visible: true});
                    }}
                    className="store-verification-button"
                >
                    Accept Verification
                </Button>

            );

        }

    }


    declineVerificationButton(){

        const { status , admins_declined, id} = this.props;

        if(status !== "verified" && !admins_declined.includes(id)){

            return(

                <Button
                    variant="outline-danger"
                    onClick={(e) => {

                        e.preventDefault();

                        this.setState({decline_verification_modal_visible: true});

                    }}
                    className="store-verification-button"
                >
                    Decline Verification
                </Button>

            );

        }

    }

    storeVerificationCard(){

        const { roles, store_owner, store_name, store_number} = this.props;

        if(roles.includes("root_admin") || roles.includes("account_manager")){

            return(

                <Card className="view-store-account-card">

                    <Card.Header
                        as="h5"
                        className="view-store-account-card-header"
                    >
                        Store Verification Guidelines
                    </Card.Header>

                    <Card.Body id="store-verification-card-body">


                        <Form>

                            {this.currentReviewers()}


                            <div>

                                <Form.Label className="store-verification-label">
                                    Guidelines
                                </Form.Label>

                                <Alert
                                    variant="warning"
                                    className="store-verification-instructions"
                                >
                                    Please do all of the following tasks to verify and validate all of the store's information.
                                    If the store is legit, legal and all information is correct, click on the accept verification
                                    button. Else, click on the decline verification button and enter the reason for declining verification.
                                    Please don't forget to check the time in the store's country before calling to avoid disturbing the
                                    person you are calling.
                                </Alert>


                                <Alert variant="primary" className="store-verification-process">
                                    Document Validation and Internet Search
                                </Alert>

                                <ListGroup className="store-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Make sure the business license is certified and signed by a sworn translator,
                                        a notary public or other relevant government authority.
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Check if the store owner name is included in the business license.
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Lookup information about the store on Google and view its location
                                        on Google Maps by clicking the view store location button above. Make sure the store
                                        exists and that its present on Google Maps. If it exists on Google Maps, check
                                        if the store number matches that on Google (could be wrong on Google or different
                                        number could be provided).
                                    </ListGroup.Item>

                                </ListGroup>


                                <Alert variant="primary" className="store-verification-process">
                                    Calling the Store
                                </Alert>


                                <ListGroup className="store-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Call the store and ask them if the store owner ({store_owner}) is present and if he or she
                                        is the store owner.
                                    </ListGroup.Item>


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                       When talking to the store owner say and ask them the following:<br/>
                                        1) Hello this is [YOUR NAME] from Wavelix an online marketplace and e-commerce company.<br/>
                                        2) Did you sign up your store on our platform?<br/>
                                        3) Thank the store owner and tell them once their store is verified they will receive an email.<br/>
                                    </ListGroup.Item>



                                </ListGroup>


                                <Alert variant="primary" className="store-verification-process">
                                    Contacting the government authority
                                </Alert>


                                <ListGroup className="store-verification-guidelines-container">

                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        Lookup the official contact information of the relevant government authority,
                                        or call the number of the authority provided on the business license if available
                                        (make sure it is legit). Call them if possible or email them, if emailing them
                                        you may also attach the business license as well.
                                    </ListGroup.Item>


                                    <ListGroup.Item
                                        className="store-verification-guidelines"
                                    >
                                        When contacting them tell them and ask them about the following:<br/>
                                        1) Hello this is [YOUR NAME] from Wavelix an online marketplace and e-commerce company.
                                        We are currently verifying businesses signing up for our platform and would like to ask
                                        a couple of questions to verify a store that just signed up.<br/>
                                        2) Is there a store or company called {store_name} in your jurisdiction and is it
                                        legally authorized to conduct business?<br/>
                                        3) Do you have information about what the store sells?<br/>
                                        4) Is the owner of the store called {store_owner}?<br/>
                                        5) Do you know what the number of {store_name} is? (check if it matches the store
                                        number ({store_number}) ignoring international dialing code.)<br/>
                                        6) Thank the person on the phone.<br/>
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

        const store_user_id = params.store_user_id;

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
                            declineStoreVerification
                        } = this.props;

                        declineStoreVerification(
                            store_user_id,
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


    exitAcceptVerificationModal(){
        this.setState({accept_verification_modal_visible: false});
    }

    acceptVerificationModal(){

        const { accept_verification_modal_visible, history, params } = this.state;

        const store_user_id = params.store_user_id;

        if(accept_verification_modal_visible){

            return(

                <Modal
                    show={accept_verification_modal_visible}
                    onHide={() => {
                        this.exitAcceptVerificationModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Accept Verification</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p>
                            By accepting the verification request, you confirm that you have gone
                            through all necessary store verification guidelines and have made
                            sure that the store business license is valid, that the store owner
                            has indeed created an account for their store, and that the store is
                            legally authorized to conduct business  in its jurisdiction.
                        </p>

                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitAcceptVerificationModal();

                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant="success"
                            onClick={(e) => {

                                e.preventDefault();

                                const {
                                    acceptStoreVerification,
                                    access_token,
                                    client,
                                    uid
                                } = this.props;

                                acceptStoreVerification(store_user_id, access_token, client, uid, history);

                                this.exitAcceptVerificationModal();

                            }}
                        >
                            Accept
                        </Button>

                    </Modal.Footer>


                </Modal>

            );

        }

    }

    show(){

        const {
            initializing_page,
            store_owner,
            store_username,
            store_name,
            status,
            review_status,
            country,
            has_sensitive_products,
            business_license,
            registered_at,
            location,
            store_owner_number,
            store_number,
            store_email
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

                    <div id="view-store-account-container">

                        <Card className="view-store-account-card">

                            <Card.Header
                                as="h5"
                                className="view-store-account-card-header"
                            >
                                {store_name}
                            </Card.Header>

                            <Card.Body>

                                <Form>

                                    <Form.Group  >

                                        <Form.Label >
                                            Store Owner
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_owner}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Store Email
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_email}
                                        />

                                    </Form.Group>

                                    <Form.Group  >

                                        <Form.Label >
                                            Store Username
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_username}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Store Name
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_name}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Store Number
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_number}
                                        />

                                    </Form.Group>

                                    <Form.Group  >

                                        <Form.Label >
                                            Store Owner Number
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_owner_number}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Account Status
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(status)}
                                        />

                                    </Form.Group>



                                    <Form.Group  >

                                        <Form.Label >
                                            Review Status
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(review_status)}
                                        />

                                    </Form.Group>

                                    {this.verifiedBy()}


                                    <Form.Group  >

                                        <Form.Label >
                                            Store Country
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={country}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Store is a restaurant, cafe, etc.
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={has_sensitive_products ? 'Yes' : 'No'}
                                        />

                                    </Form.Group>


                                    <Form.Group  >

                                        <Form.Label >
                                            Registered At
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={registered_at}
                                        />

                                    </Form.Group>

                                   <div id="view-store-data-container">


                                       <Button
                                           className="view-store-data-button"
                                           variant="outline-primary"
                                           onClick={(e) => {

                                               e.preventDefault();

                                               this.setState({business_license_modal_visible: true});

                                               window.open(business_license, "_blank")
                                           }}
                                       >
                                           Download Business License
                                       </Button>

                                       <Button
                                           className="view-store-data-button"
                                           variant="outline-primary"
                                           onClick={(e) => {

                                               e.preventDefault();

                                               const latitude = location.latitude;

                                               const longitude = location.longitude;

                                               const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                                               window.open(url, "_blank")

                                           }}
                                       >
                                           View Store Location
                                       </Button>

                                   </div>


                                </Form>

                            </Card.Body>

                        </Card>


                        {this.storeVerificationCard()}

                    </div>


                    {this.businessLicenseModal()}

                    {this.acceptVerificationModal()}

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
        store_owner,
        store_username,
        store_name,
        status,
        review_status,
        country,
        has_sensitive_products,
        business_license,
        registered_at,
        location,
        store_owner_number,
        store_number,
        verified_by,
        current_reviewers,
        store_email,
        admins_declined,
        unverified_reasons
    } = state.view_store_account;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
        initializing_page,
        store_owner,
        store_username,
        store_name,
        status,
        review_status,
        country,
        has_sensitive_products,
        business_license,
        registered_at,
        location,
        store_owner_number,
        store_number,
        verified_by,
        current_reviewers,
        store_email,
        admins_declined,
        unverified_reasons
    };


};

export default connect(mapStateToProps, {
    getStoreData,
    clearViewStoreAccountState,
    storeAccountReviewersChanged,
    storeAccountStatusChanged,
    storeAccountReviewStatusChanged,
    storeAccountVerifiedByChanged,
    storeAccountAdminsDeclinedChanged,
    storeAccountUnverifiedReasonsChanged,
    acceptStoreVerification,
    declineStoreVerification
})(ViewStoreAccount);
