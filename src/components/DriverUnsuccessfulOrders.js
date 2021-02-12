import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    initializeDriverUnsuccessfulOrdersPage,
    clearDriverUnsuccessfulOrdersState,
    driverUnsuccessfulOrdersResolversChanged,
    driverUnsuccessfulOrdersUpdated,
    driverBalanceUsdChanged,
    driverAccountStatusChanged,
    cancelUnsuccessfulOrder,
    confirmUnsuccessfulOrder
} from "../actions";
import {  Spinner, Card, Form, Button, Modal, Alert, ListGroup, Accordion, Image } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";
import Timer from 'react-compound-timer';

class DriverUnsuccessfulOrders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const view_driver_unsuccessful_orders_channel_subscription = null;

        const orders_resolved_modal_visible = false;

        const selected_order_id = null;

        const cancel_order_modal_visible = false;

        const confirm_order_modal_visible = false;

        this.state = {
            history,
            params,
            cable,
            view_driver_unsuccessful_orders_channel_subscription,
            orders_resolved_modal_visible,
            selected_order_id,
            cancel_order_modal_visible,
            confirm_order_modal_visible
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
            driverUnsuccessfulOrdersUpdated,
            driverBalanceUsdChanged,
            driverAccountStatusChanged
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

                                    this.setState({
                                        orders_resolved_modal_visible: true,
                                        selected_order_id: null,
                                        cancel_order_modal_visible: false,
                                        confirm_order_modal_visible: false
                                    });

                                }

                            }


                            if(data.driver_balance_usd !== undefined){

                                const driver_balance_usd = data.driver_balance_usd;

                                driverBalanceUsdChanged(driver_balance_usd);

                            }

                            if(data.driver_account_status !== undefined){

                                const driver_account_status = data.driver_account_status;

                                driverAccountStatusChanged(driver_account_status);

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


    renderProductOptions(product_options){

        return _.map(product_options, (value, key) => {

            return(

                <Form.Group key={key}>

                    <Form.Label >
                        {_.startCase(key)}
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={_.startCase(value)}
                    />

                </Form.Group>

            );

        });

    }


    orderProducts(products){

        return _.map(products, (product, index) => {

            return(

                <Card key={index}>


                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey={product.id.toString()}>
                            {product.name}
                        </Accordion.Toggle>

                    </Card.Header>

                    <Accordion.Collapse eventKey={product.id.toString()}>

                        <Card.Body>


                            <div className="unsuccessful-order-product-image-container">

                                <Image
                                    className="unsuccessful-order-product-image"
                                    src={product.picture}
                                    thumbnail
                                />

                            </div>



                            <Form.Group>

                                <Form.Label >
                                    Quantity
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={product.quantity}
                                />

                            </Form.Group>

                            <Form.Group>

                                <Form.Label >
                                    Item Price
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${product.price} ${product.currency}`}
                                />

                            </Form.Group>


                            {this.renderProductOptions(product.product_options)}



                        </Card.Body>

                    </Accordion.Collapse>

                </Card>

            );

        });

    }



    unsuccessfulOrdersList(){

        const { unsuccessful_orders } = this.props;

        const {  history } = this.state;

        return _.map(unsuccessful_orders, (order, index) => {

            const store_name = order.store_name;

            const customer_name = _.startCase(order.customer_name);


            const order_resolve_time_limit = new Date(order.resolve_time_limit).getTime();

            const current_time = new Date().getTime();

            const time_passed = order_resolve_time_limit - current_time;

            const initial_time =  time_passed  < 0 ? 0 : time_passed;




            return(

                <Card key={index}>

                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                           From {store_name} to {customer_name}
                        </Accordion.Toggle>


                        <Timer
                            initialTime={initial_time}
                            direction="backward"
                        >
                            {() => (
                                <React.Fragment>

                                    ( <Timer.Days /> days&nbsp;

                                    <Timer.Hours /> hours&nbsp;

                                    <Timer.Minutes /> minutes&nbsp;

                                    <Timer.Seconds /> seconds left )&nbsp;

                                </React.Fragment>
                            )}
                        </Timer>


                    </Card.Header>

                    <Accordion.Collapse eventKey={index.toString()}>

                        <Card.Body>


                            <Form.Group>

                                <Form.Label >
                                    Time Left To Resolve Order
                                </Form.Label>


                                <br/>

                                <Timer
                                    initialTime={initial_time}
                                    direction="backward"
                                >
                                    {() => (
                                        <React.Fragment>

                                            <Timer.Days /> days&nbsp;

                                            <Timer.Hours /> hours&nbsp;

                                            <Timer.Minutes /> minutes&nbsp;

                                            <Timer.Seconds /> seconds&nbsp;

                                        </React.Fragment>
                                    )}
                                </Timer>


                            </Form.Group>



                            <Form.Group>

                                <Form.Label >
                                    Total Price
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${order.total_price} ${order.total_price_currency}`}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Delivery Fee
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${order.delivery_fee} ${order.delivery_fee_currency}`}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Order Type
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${_.startCase(order.order_type)}`}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Ordered At
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.ordered_at}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Delivery Time Limit
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.delivery_time_limit}
                                />

                            </Form.Group>



                            <Form.Group>

                                <div className="driver-unsuccessful-orders-label-link">

                                    <Form.Label >
                                        Store Name
                                    </Form.Label>

                                    <Button
                                        variant="link"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            history.push(`/store-accounts/store_user_id=${order.store_user_id}`);

                                        }}
                                    >
                                        View Account
                                    </Button>

                                </div>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={store_name}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Store Owner
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.store_owner}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Store Owner Number
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.store_owner_number}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Store Number
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.store_number}
                                />

                            </Form.Group>


                            <Form.Group>

                                <div className="driver-unsuccessful-orders-label-link">

                                    <Form.Label >
                                        Customer Name
                                    </Form.Label>

                                    <Button
                                        variant="link"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            history.push(`/customer-accounts/customer_user_id=${order.customer_user_id}`);

                                        }}
                                    >
                                        View Account
                                    </Button>

                                </div>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={customer_name}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Customer Number
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={order.customer_number}
                                />

                            </Form.Group>


                            <Button
                                variant="outline-primary"
                                className="unsuccessful-order-data-button"
                                onClick={(e) => {

                                    e.preventDefault();

                                    const delivery_location = order.delivery_location;

                                    const latitude = delivery_location.latitude;

                                    const longitude = delivery_location.longitude;

                                    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                                    window.open(url, "_blank");


                                }}
                            >
                                View Delivery Location
                            </Button>


                            <Form.Group>

                                <Form.Label >
                                    Products
                                </Form.Label>

                                <Accordion id="unsuccessful-order-products-accordion">

                                    {this.orderProducts(order.products)}

                                </Accordion>

                            </Form.Group>


                            <div
                                className="unsuccessful-order-action-buttons-container"
                            >


                                <Button
                                    variant="outline-danger"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                            selected_order_id: order.id,
                                            cancel_order_modal_visible: true
                                        });
                                    }}
                                    className="unsuccessful-order-action-button"
                                >
                                    Cancel Order
                                </Button>


                                <Button
                                    variant="outline-success"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                            selected_order_id: order.id,
                                            confirm_order_modal_visible: true
                                        });
                                    }}
                                    className="unsuccessful-order-action-button"
                                >
                                    Confirm Order
                                </Button>


                            </div>



                        </Card.Body>

                    </Accordion.Collapse>

                </Card>

            );

        });

    }


    unsuccessfulOrders(){

        const { unsuccessful_orders } = this.props;

        if(unsuccessful_orders.length > 0){

            return(

                <Accordion id="unsuccessful-orders-accordion">

                    {this.unsuccessfulOrdersList()}

                </Accordion>

            );

        }

    }


    exitCancelOrderModal(){

        this.setState({cancel_order_modal_visible: false, selected_order_id: null});

    }


    exitConfirmOrderModal(){

        this.setState({confirm_order_modal_visible: false, selected_order_id: null});

    }

    confirmOrderModal(){

        const {  confirm_order_modal_visible, selected_order_id, history } = this.state;

        if(confirm_order_modal_visible && selected_order_id !== null){

            return(

                <Modal
                    show={confirm_order_modal_visible}
                    onHide={() => {
                        this.exitConfirmOrderModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Confirm Order</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p className="unsuccessful-order-modal-paragraph">
                            By confirming the order you confirm that you have gone through all the
                            necessary guidelines for resolving an unsuccessful order, and have confirmed
                            that the customer received their order by contacting them.
                        </p>

                    </Modal.Body>


                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitConfirmOrderModal();

                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant="success"
                            onClick={(e) => {

                                e.preventDefault();

                                const { confirmUnsuccessfulOrder, access_token, client, uid} = this.props;

                                confirmUnsuccessfulOrder(access_token, client, uid, history, selected_order_id);

                                this.exitConfirmOrderModal();

                            }}
                        >
                            Confirm Order
                        </Button>


                    </Modal.Footer>



                </Modal>

            );

        }

    }

    cancelOrderModal(){

        const {  cancel_order_modal_visible, selected_order_id, history } = this.state;

        if(cancel_order_modal_visible && selected_order_id !== null){

            return(

                <Modal
                    show={cancel_order_modal_visible}
                    onHide={() => {
                        this.exitCancelOrderModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Cancel Order</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p className="unsuccessful-order-modal-paragraph">
                            By canceling the order you confirm that you have gone through all the
                            necessary guidelines for resolving an unsuccessful order, and have concluded
                            that the driver has stolen the order or won't be delivering the order to the
                            customer (waited an adequate amount of time, contacted the customer and driver
                            didn't arrive, driver not responding, etc). A refund will be issued to the customer
                            for their order, the driver's account will be permanently blocked, and a payment will
                            be issued to the store for the cost of the ordered products from the driver's balance.
                        </p>

                    </Modal.Body>


                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitCancelOrderModal();

                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant="danger"
                            onClick={(e) => {

                                e.preventDefault();

                                const { cancelUnsuccessfulOrder, access_token, client, uid} = this.props;


                                cancelUnsuccessfulOrder(access_token, client, uid, history, selected_order_id);

                                this.exitCancelOrderModal();

                            }}
                        >
                            Cancel Order
                        </Button>


                    </Modal.Footer>



                </Modal>

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
            driver_longitude,
            resolving_order
        } = this.props;

        const {  history , params} = this.state;

        const driver_id = params.driver_id;

        if(initializing_page || resolving_order){

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


                                        {this.unsuccessfulOrders()}







                                    </div>

                                </Form>

                            </Card.Body>

                        </Card>


                    </div>


                    {this.ordersResolvedModal()}

                    {this.cancelOrderModal()}

                    {this.confirmOrderModal()}

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
        current_resolvers,
        resolving_order
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
        current_resolvers,
        resolving_order
    };

};

export default connect(mapStateToProps, {
    initializeDriverUnsuccessfulOrdersPage,
    clearDriverUnsuccessfulOrdersState,
    driverUnsuccessfulOrdersResolversChanged,
    driverUnsuccessfulOrdersUpdated,
    driverBalanceUsdChanged,
    driverAccountStatusChanged,
    cancelUnsuccessfulOrder,
    confirmUnsuccessfulOrder
})(DriverUnsuccessfulOrders);