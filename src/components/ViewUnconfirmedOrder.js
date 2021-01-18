import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getUnconfirmedOrder,
    clearViewUnconfirmedOrderState,
    unconfirmedOrderReviewersChanged,
    unconfirmedOrderReceiptUrlChanged
} from "../actions";
import {  Spinner, Card, Form, Button, Accordion, Image, Alert, ListGroup} from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import Timer from 'react-compound-timer'
import _ from "lodash";

class ViewUnconfirmedOrder extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const view_unconfirmed_order_channel_subscription = null;

        this.state = {
            history,
            params,
            cable,
            view_unconfirmed_order_channel_subscription
        };

    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const view_unconfirmed_order_channel_subscription = this.state.view_unconfirmed_order_channel_subscription;

        if(view_unconfirmed_order_channel_subscription !== null){

            cable.subscriptions.remove(view_unconfirmed_order_channel_subscription);

        }

        this.props.clearViewUnconfirmedOrderState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getUnconfirmedOrder,
            unconfirmedOrderReviewersChanged,
            unconfirmedOrderReceiptUrlChanged
        } = this.props;

        const { history, params } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            const order_id = params.order_id;

            getUnconfirmedOrder(access_token, client, uid, history, order_id);

            const cable = this.state.cable;

            let view_unconfirmed_order_channel_subscription = this.state.view_unconfirmed_order_channel_subscription;

            if(view_unconfirmed_order_channel_subscription === null){

                view_unconfirmed_order_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'ViewUnconfirmedOrderChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        order_id: order_id
                    },
                    {
                        connected: () => {

                            console.log('ViewUnconfirmedOrderChannel Connected!');

                        },
                        received: (data) => {

                            console.log("ViewUnconfirmedOrderChannel Received!");

                            console.log(data);


                            if(data.current_reviewers !== undefined){

                                const current_reviewers = data.current_reviewers;

                                console.log(current_reviewers);

                                unconfirmedOrderReviewersChanged(current_reviewers);

                            }


                            if(data.receipt_url !== undefined){

                                const receipt_url = data.receipt_url;

                                console.log(receipt_url);

                                unconfirmedOrderReceiptUrlChanged(receipt_url);

                            }


                        }
                    }
                );

                this.setState({view_unconfirmed_order_channel_subscription: view_unconfirmed_order_channel_subscription});

            }


        }

    }


    getInitialTime(){

        const delivery_time_limit = new Date(this.props.delivery_time_limit).getTime();

        const current_time = new Date().getTime();

        return ( current_time - delivery_time_limit );

    }


    renderReceipt(){

        const { receipt_url } = this.props;

        if(!_.isEmpty(receipt_url)){

            return(

                <Button
                    variant="outline-primary"
                    className="view-unconfirmed-order-data-button"
                    onClick={(e) => {

                        e.preventDefault();

                        window.open(receipt_url, "_blank")
                    }}
                >
                    View Order Receipt
                </Button>

            );

        }else{

            return(

                <p id="unconfirmed-order-receipt-not-found">
                    Order Receipt Not Attached
                </p>

            );

        }

    }

    renderDeliveryLocation(){

        const { delivery_location } = this.props;

        const latitude = delivery_location.latitude;

        const longitude = delivery_location.longitude;

        return(


            <Button
                variant="outline-primary"
                className="view-unconfirmed-order-data-button"
                onClick={(e) => {

                    e.preventDefault();

                    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                    window.open(url, "_blank");


                }}
            >
                View Delivery Location
            </Button>


        );


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

    renderProducts(){

        const products = this.props.products;

        return _.map(products, (product, index) => {

            return(

                <Card key={index}>


                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                            {product.name}
                        </Accordion.Toggle>

                    </Card.Header>

                    <Accordion.Collapse eventKey={index.toString()}>

                        <Card.Body>


                            <div className="unconfirmed-order-product-image-container">

                                <Image
                                    className="unconfirmed-order-product-image"
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

    currentReviewers(){


        const { current_reviewers } = this.props;

        if( current_reviewers.length > 0){

            return(

                <div >


                    <Form.Label className="post-case-form-label">
                        Currently Reviewing
                    </Form.Label>



                    <div >

                        {
                            _.map(current_reviewers, (reviewer, index) => {

                                return(

                                    <Button
                                        key={index}
                                        variant="outline-success"
                                        id="unconfirmed-order-reviewer-button"
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

    show(){

        const  {
            initializing_page,
            store_name,
            store_user_id,
            store_owner,
            store_owner_number,
            store_number,
            store_has_sensitive_products,
            customer_name,
            customer_user_id,
            customer_number,
            country,
            ordered_at,
            total_price,
            total_price_currency,
            delivery_time_limit
        } = this.props;

        const {  history } = this.state;


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

                    <div id="view-unconfirmed-order-container">

                        <Card className="view-unconfirmed-order-card">

                            <Card.Header
                                as="h5"
                                className="view-unconfirmed-order-card-header"
                            >
                                Order Details
                            </Card.Header>

                            <Card.Body>

                                <Form>


                                    <Form.Group>

                                        <div className="unconfirmed-order-label-link">

                                            <Form.Label >
                                                Store Name
                                            </Form.Label>

                                            <Button
                                                variant="link"
                                                onClick={(e) => {

                                                    e.preventDefault();

                                                    history.push(`/store-accounts/store_user_id=${store_user_id}`);

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
                                            value={store_owner}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Store Owner Number
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_owner_number}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Store Number
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_number}
                                        />

                                    </Form.Group>

                                    <Form.Group>

                                        <Form.Label >
                                            Food Service
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_has_sensitive_products ? 'Yes' : 'No'}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <div className="unconfirmed-order-label-link">

                                            <Form.Label >
                                                Customer Name
                                            </Form.Label>

                                            <Button
                                                variant="link"
                                                onClick={(e) => {

                                                    e.preventDefault();

                                                    history.push(`/customer-accounts/customer_user_id=${customer_user_id}`);

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
                                            value={customer_number}
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
                                            Time Exceeded
                                        </Form.Label>

                                        <br/>


                                        <Timer
                                            initialTime={this.getInitialTime()}
                                            direction="forward"
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
                                            Ordered At
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={ordered_at}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Delivery Time Limit
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={delivery_time_limit}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Total Price
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={`${total_price} ${total_price_currency}`}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Products
                                        </Form.Label>

                                        <Accordion id="unconfirmed-order-products-container">

                                            {this.renderProducts()}

                                        </Accordion>



                                    </Form.Group>



                                    {this.renderReceipt()}

                                    {this.renderDeliveryLocation()}



                                </Form>

                            </Card.Body>


                        </Card>



                        <Card className="view-unconfirmed-order-card">

                            <Card.Header
                                as="h5"
                                className="view-unconfirmed-order-card-header"
                            >
                                Resolving Unconfirmed Order Guidelines
                            </Card.Header>


                            <Card.Body>

                                <Form>

                                    {this.currentReviewers()}

                                    <div>

                                        <Form.Label className="unconfirmed-order-form-label">
                                            Guidelines
                                        </Form.Label>

                                        <Alert
                                            variant="warning"
                                            className="resolving-unconfirmed-order-instructions"
                                        >
                                            Please make sure to check the time in the store's and the customer's location before calling
                                            them to avoid disturbing the person you are calling (note that some locations might have different
                                            timezones even if they are within the same country). If you called the store owner or customer and
                                            they did't answer the call you may send them a message or call them again later.
                                        </Alert>


                                        <ListGroup className="resolving-unconfirmed-order-guidelines-container">




                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                Call the customer ({customer_name}) and ask them if they received the order from the store
                                                or not. Make sure to introduce yourself so the customer knows who they are talking with<br/>
                                                1) Hello this is [YOUR NAME] from Wavelix customer service<br/>
                                                2) Did you receive the order you made from {store_name} ?
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                If the customer said that they received the order, then confirm order
                                                so the store can receive the payment from the customer.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                If the customer said that they didn't receive the order, check if the store
                                                uploaded the order receipt. If the receipt was uploaded check it and if all
                                                ordered items are included, confirm the order so the store can receive the
                                                payment from the customer.
                                            </ListGroup.Item>

                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                If the store did not upload the receipt then call the store ({store_name})
                                                and ask them if they did deliver the order to the customer ({customer_name})
                                                or not<br/>
                                                1) Hello this is [YOUR NAME] from Wavelix customer service<br/>
                                                2) Did you deliver the order to your customer {customer_name} ?
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                If the store said that they did deliver the order to their customer {customer_name},
                                                then ask them to attach the receipt to the order in the orders page. Make sure to check it
                                                and if all ordered items are included, confirm the order so the store can receive the
                                                payment from the customer.
                                            </ListGroup.Item>


                                            <ListGroup.Item
                                                className="unconfirmed-order-guidelines"
                                            >
                                                If the store said that they didn't deliver the order to the customer (i.e. something happened)
                                                or couldn't prove that they delivered the order to the customer by attaching a receipt
                                                to the order and the customer claimed that they didn't receive the order, then cancel the order
                                                so that the customer can receive a refund for the order they made.
                                            </ListGroup.Item>

                                        </ListGroup>

                                        <Button
                                            variant="outline-success"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            className="unconfirmed-order-action-button"
                                        >
                                            Confirm Order
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            className="unconfirmed-order-action-button"
                                        >
                                            Cancel Order
                                        </Button>


                                    </div>

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
        logged_in,
        roles,
        id
    } = state.login;

    const {
        initializing_page,
        current_reviewers,
        store_name,
        store_user_id,
        store_owner,
        store_owner_number,
        store_number,
        store_has_sensitive_products,
        customer_name,
        customer_user_id,
        customer_number,
        country,
        delivery_time_limit,
        ordered_at,
        total_price,
        total_price_currency,
        receipt_url,
        products,
        delivery_location
    } = state.view_unconfirmed_order;


    return{
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
        initializing_page,
        current_reviewers,
        store_name,
        store_user_id,
        store_owner,
        store_owner_number,
        store_number,
        store_has_sensitive_products,
        customer_name,
        customer_user_id,
        customer_number,
        country,
        delivery_time_limit,
        ordered_at,
        total_price,
        total_price_currency,
        receipt_url,
        products,
        delivery_location
    };

};

export default connect(mapStateToProps, {
    getUnconfirmedOrder,
    clearViewUnconfirmedOrderState,
    unconfirmedOrderReviewersChanged,
    unconfirmedOrderReceiptUrlChanged
})(ViewUnconfirmedOrder);