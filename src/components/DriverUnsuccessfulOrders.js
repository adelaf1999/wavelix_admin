import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    initializeDriverUnsuccessfulOrdersPage,
    clearDriverUnsuccessfulOrdersState,
    driverUnsuccessfulOrdersResolversChanged,
    driverUnsuccessfulOrdersUpdated
} from "../actions";
import {  Spinner, Card, Form, Button, Modal, Alert, ListGroup } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";

class DriverUnsuccessfulOrders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const view_driver_unsuccessful_orders_channel_subscription = null;

        const orders_resolved_modal_visible = false;

        this.state = {
            history,
            params,
            cable,
            view_driver_unsuccessful_orders_channel_subscription,
            orders_resolved_modal_visible
        };
    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const view_driver_unsuccessful_orders_channel_subscription = this.state.view_driver_unsuccessful_orders_channel_subscription;

        if(view_driver_unsuccessful_orders_channel_subscription !== null){

            cable.subscriptions.remove(view_driver_unsuccessful_orders_channel_subscription);

        }

        this.props.clearDriverUnsuccessfulOrdersState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeDriverUnsuccessfulOrdersPage,
            driverUnsuccessfulOrdersResolversChanged,
            driverUnsuccessfulOrdersUpdated
        } = this.props;


        const { history, params, cable } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            const driver_id = params.driver_id;

            initializeDriverUnsuccessfulOrdersPage(access_token, client, uid, history, driver_id);

            let view_driver_unsuccessful_orders_channel_subscription = this.state.view_driver_unsuccessful_orders_channel_subscription;

            if(view_driver_unsuccessful_orders_channel_subscription === null){

                view_driver_unsuccessful_orders_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'ViewDriverUnsuccessfulOrdersChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        driver_id: driver_id
                    },
                    {
                        connected: () => {

                            console.log('ViewDriverUnsuccessfulOrdersChannel Connected!');

                        },
                        received: (data) => {

                            console.log("ViewDriverUnsuccessfulOrdersChannel Received!");

                            console.log(data);

                            if(data.current_resolvers !== undefined){

                                const current_resolvers = data.current_resolvers;

                                driverUnsuccessfulOrdersResolversChanged(current_resolvers);

                            }

                            if(data.unsuccessful_orders !== undefined){

                                const unsuccessful_orders = data.unsuccessful_orders;

                                driverUnsuccessfulOrdersUpdated(unsuccessful_orders);

                                if(unsuccessful_orders.length === 0){

                                    this.setState({orders_resolved_modal_visible: true});

                                }

                            }

                        }
                    }
                );

                this.setState({view_driver_unsuccessful_orders_channel_subscription: view_driver_unsuccessful_orders_channel_subscription});

            }


        }

    }


    exitOrdersResolvedModal(){

        const { history } = this.state;

        this.setState({orders_resolved_modal_visible: false});

        history.push("/unsuccessful-orders");

    }

    ordersResolvedModal(){

        const { orders_resolved_modal_visible } = this.state;

        if(orders_resolved_modal_visible){

            return(

                <Modal
                    show={orders_resolved_modal_visible}
                    onHide={() => {
                        this.exitOrdersResolvedModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header >

                        <Modal.Title>Unsuccessful Orders Resolved</Modal.Title>

                    </Modal.Header>


                    <Modal.Body>

                        <p>
                            All unsuccessful orders of this driver have been resolved.
                        </p>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitOrdersResolvedModal();

                            }}
                        >
                            Close
                        </Button>

                    </Modal.Footer>

                </Modal>

            );

        }

    }


    currentResolvers(){

        const { current_resolvers } = this.props;

        if(current_resolvers.length > 0){

            return(

                <div >


                    <Form.Label className="driver-unsuccessful-orders-form-label">
                        Currently Resolving
                    </Form.Label>



                    <div >

                        {
                            _.map(current_resolvers, (resolver, index) => {

                                return(

                                    <Button
                                        key={index}
                                        variant="outline-success"
                                        id="driver-unsuccessful-orders-resolver-button"
                                    >
                                        {resolver + " •" }
                                    </Button>

                                );

                            })
                        }

                    </div>


                </div>



            );


        }


    }


    show(){

        const  {
            initializing_page,
            driver_name,
            driver_phone_number,
            driver_country,
            driver_account_status,
            driver_balance_usd,
            driver_latitude,
            driver_longitude
        } = this.props;

        const {  history , params} = this.state;

        const driver_id = params.driver_id;

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

                    <div id="driver-unsuccessful-orders-container">


                        <div id="driver-unsuccessful-orders-warning-container">

                            <Alert variant="warning" id="driver-unsuccessful-orders-warning-text">
                                For orders where the store doesn't provide delivery (i.e. Wavelix drivers will be doing delivery),
                                we only have exactly 7 days to resolve each order from the time the order was accepted
                                by the driver. If the time limit to resolve an order passed and the order was not resolved,
                                and the order had to be canceled, we might not be able to recover the cost of the product(s)
                                for the store from the driver's card if the driver indeed stole them.
                            </Alert>

                        </div>


                        <Card className="driver-unsuccessful-orders-card">

                            <Card.Header
                                as="h5"
                                className="driver-unsuccessful-orders-card-header"
                            >
                                Driver Information
                            </Card.Header>

                            <Card.Body>

                                <Form>

                                    <Form.Group>

                                        <div className="driver-unsuccessful-orders-label-link">

                                            <Form.Label >
                                                Driver Name
                                            </Form.Label>

                                            <Button
                                                variant="link"
                                                onClick={(e) => {

                                                    e.preventDefault();

                                                    history.push(`/driver-accounts/driver_id=${driver_id}`);

                                                }}
                                            >
                                                View Account
                                            </Button>

                                        </div>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={driver_name}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Phone Number
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={driver_phone_number}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Country
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={driver_country}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Account Status
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(driver_account_status)}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Balance
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={`${driver_balance_usd} USD`}
                                        />

                                    </Form.Group>



                                    <Button
                                        variant="outline-primary"
                                        id="driver-last-available-location-button"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            const url = `https://www.google.com/maps/search/?api=1&query=${driver_latitude},${driver_longitude}`;

                                            window.open(url, "_blank")

                                        }}
                                    >
                                        View Last Available Location
                                    </Button>

                                </Form>

                            </Card.Body>


                        </Card>



                        <Card className="driver-unsuccessful-orders-card">

                            <Card.Header
                                as="h5"
                                className="driver-unsuccessful-orders-card-header"
                            >
                                Unsuccessful Orders
                            </Card.Header>


                            <Card.Body>

                                <Form>

                                    {this.currentResolvers()}

                                    <div>

                                        <Form.Label className="driver-unsuccessful-orders-form-label">
                                            Guidelines
                                        </Form.Label>


                                        <Alert
                                            variant="warning"
                                            className="resolving-unsuccessful-orders-instructions"
                                        >
                                            Please do all of the following guidelines and procedures to resolve each unsuccessful
                                            order. If you had to contact the customer, driver or store please check the time in
                                            their location to avoid disturbing them. Please make sure to never pass the time
                                            limit we have to resolve each order as the driver might have planned to steal the
                                            order, and we might not be able to recover cost of the stolen products for the store
                                            after the time limit is passed.
                                        </Alert>


                                        <ListGroup className="resolving-unsuccessful-orders-guidelines-container">

                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                Call the customer and ask them if they have received the order they
                                                made from the store or not. Please make sure to introduce yourself
                                                properly so the customer knows who they are talking with:<br/>
                                                1) Hello this is [YOUR NAME] from Wavelix customer service<br/>
                                                2) Did you receive the order you made from the store?
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                If the customer claimed that they have received their order,
                                                click on the confirm order button.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                Else, call the driver and tell them that we have contacted the customer
                                                and they told us that they haven't received their order and we would like
                                                to know why their order hasn't been delivered yet.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                If the driver said that they are stuck in traffic, they got lost on
                                                their way to the delivery location, or that an accident happened with
                                                them, you can choose to wait for an adequate amount of time and then
                                                check if the driver has delivered the order to the customer.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                If the driver claimed that an emergency happened with them, and they
                                                did prove to you (by showing evidence) that indeed an emergency happened
                                                to them, you can contact the store and customer and tell them about it and
                                                wait an adequate amount of time and then check if the customer received their order.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unsuccessful-order-guidelines"
                                            >
                                                If you have deduced that the driver has most likely planned to steal the order,
                                                hasn't delivered the order to the customer yet and the time limit to resolve
                                                the order is close, you contacted the customer again and they didn't receive their
                                                order, or if the driver is not responding when you are contacting them, etc; immediately
                                                click on cancel order so the customer gets a refund for their order, and the store gets
                                                the cost of the products already authorized from the driver's card.
                                            </ListGroup.Item>


                                        </ListGroup>




                                    </div>

                                </Form>

                            </Card.Body>

                        </Card>


                    </div>


                    {this.ordersResolvedModal()}

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
        unsuccessful_orders,
        driver_name,
        driver_phone_number,
        driver_country,
        driver_account_status,
        driver_balance_usd,
        driver_latitude,
        driver_longitude,
        current_resolvers
    } = state.driver_unsuccessful_orders;

    return{
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        unsuccessful_orders,
        driver_name,
        driver_phone_number,
        driver_country,
        driver_account_status,
        driver_balance_usd,
        driver_latitude,
        driver_longitude,
        current_resolvers
    };

};

export default connect(mapStateToProps, {
    initializeDriverUnsuccessfulOrdersPage,
    clearDriverUnsuccessfulOrdersState,
    driverUnsuccessfulOrdersResolversChanged,
    driverUnsuccessfulOrdersUpdated
})(DriverUnsuccessfulOrders);