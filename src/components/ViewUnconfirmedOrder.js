import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getUnconfirmedOrder,
    clearViewUnconfirmedOrderState,
    unconfirmedOrderReviewersChanged
} from "../actions";
import {  Spinner, Card, Form, Button, Accordion, Image} from "react-bootstrap";
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
            unconfirmedOrderReviewersChanged
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
    unconfirmedOrderReviewersChanged
})(ViewUnconfirmedOrder);