import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    initializeViewOrderPage,
    clearViewOrderState
} from "../actions";
import _ from "lodash";
import {  Spinner, Card, Form, Button, Accordion, Image } from "react-bootstrap";
import Timer from 'react-compound-timer';

class ViewOrder extends Component{

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

        this.props.clearViewOrderState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeViewOrderPage
        } = this.props;

        const { history, params } = this.state;

        if(!logged_in){

            history.push("/");

        } else if( !roles.includes("root_admin") ){

            history.push("/home");

        } else{

            const order_id = params.order_id;

            initializeViewOrderPage(access_token, client, uid, history, order_id);

        }

    }




    renderDriverDetails(){

        const { driver_name, driver_id } = this.props;

        const { history } = this.state;


        if(driver_name !== "" && driver_id !== ""){


            return(

                <Form.Group>

                    <div className="order-label-link">

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


            );

        }

    }


    renderDeliveryFee(){

        const { delivery_fee, delivery_fee_currency } = this.props;

        if(delivery_fee !== "" && delivery_fee_currency !== ""){

            return(

                <Form.Group>

                    <Form.Label >
                        Delivery Fee
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={`${delivery_fee} ${delivery_fee_currency}`}
                    />


                </Form.Group>

            );

        }

    }

    renderOrderType(){

        const { order_type } = this.props;

        if(order_type !== ""){

            return(

                <Form.Group>

                    <Form.Label >
                        Order Type
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={_.startCase(order_type)}
                    />


                </Form.Group>

            );

        }

    }


    renderOrderCanceledReason(){

        const { order_canceled_reason } = this.props;


        if(order_canceled_reason !== ""){

            return(

                <Form.Group>

                    <Form.Label >
                        Order Canceled Reason
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={order_canceled_reason}
                    />


                </Form.Group>


            );

        }

    }


    renderStoreFulfilledOrder(){

        const { store_fulfilled_order } = this.props;

        if(store_fulfilled_order !== null){

            return(

                <Form.Group>

                    <Form.Label >
                        Store Fulfilled Order
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={store_fulfilled_order ? 'Yes' : 'No'}
                    />


                </Form.Group>

            );

        }

    }


    renderDriverFulfilledOrder(){

        const { driver_fulfilled_order } = this.props;

        if(driver_fulfilled_order !== null){

            return(

                <Form.Group>

                    <Form.Label >
                        Driver Fulfilled Order
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={driver_fulfilled_order ? 'Yes' : 'No'}
                    />


                </Form.Group>

            );

        }

    }


    renderDeliveryTimeLimit(){

        const { delivery_time_limit } = this.props;

        if(delivery_time_limit !== ''){

            return(

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

            );

        }


    }


    renderStoreArrivalTimeLimit(){

        const { store_arrival_time_limit } = this.props;

        if(store_arrival_time_limit !== ''){

            return(

                <Form.Group>

                    <Form.Label >
                        Store Arrival Time Limit
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={store_arrival_time_limit}
                    />


                </Form.Group>

            );

        }

    }


    renderConfirmedBy(){

        const { confirmed_by } = this.props;

        if(confirmed_by !== ""){

            return(

                <Form.Group>

                    <Form.Label >
                        Confirmed By
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={confirmed_by}
                    />


                </Form.Group>

            );

        }

    }

    renderCanceledBy(){

        const {  canceled_by } = this.props;

        if(canceled_by !== ""){

            return(

                <Form.Group>

                    <Form.Label >
                        Canceled By
                    </Form.Label>

                    <Form.Control
                        readOnly
                        type="text"
                        value={canceled_by}
                    />


                </Form.Group>

            );

        }


    }

    renderResolveTimeLimit(){

        const { resolve_time_limit } = this.props;


        if(resolve_time_limit !== ""){


            const order_resolve_time_limit = new Date(resolve_time_limit).getTime();

            const current_time = new Date().getTime();

            const time_passed = order_resolve_time_limit - current_time;

            const initial_time =  time_passed  < 0 ? 0 : time_passed;


            return(

                <Form.Group>

                    <Form.Label >
                        Resolve Time Limit
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

                                <Timer.Seconds /> seconds left&nbsp;

                            </React.Fragment>
                        )}
                    </Timer>


                </Form.Group>

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

    renderProducts(){

        const { products } = this.props;

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


                            <div className="order-product-image-container">

                                <Image
                                    className="order-product-image"
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


    renderViewReceiptButton(){

        const { receipt_url } = this.props;

        if(receipt_url !== ""){

            return(

                <Button
                    variant="outline-primary"
                    className="order-data-button"
                    onClick={(e) => {

                        e.preventDefault();

                        window.open(receipt_url, "_blank");


                    }}
                >
                    View Order Receipt
                </Button>


            );

        }


    }


    renderPayments(payments){

        return _.map(payments, (payment, index) => {

            return(

                <Card key={index}>


                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey={payment.id.toString()}>
                            Payment of {payment.net} {payment.currency}
                        </Accordion.Toggle>

                    </Card.Header>

                    <Accordion.Collapse eventKey={payment.id.toString()}>

                        <Card.Body>


                            <Form.Group>

                                <Form.Label >
                                    Amount
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${payment.amount} ${payment.currency}`}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Fee
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${payment.fee} ${payment.currency}`}
                                />

                            </Form.Group>


                            <Form.Group>

                                <Form.Label >
                                    Net
                                </Form.Label>

                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={`${payment.net} ${payment.currency}`}
                                />

                            </Form.Group>

                        </Card.Body>

                    </Accordion.Collapse>

                </Card>

            );

        });

    }

    renderStorePayments(){

        const { store_payments } = this.props;

        if(store_payments.length > 0){

            return(

                <Form.Group>

                    <Form.Label >
                        Store Payments
                    </Form.Label>

                    <Accordion className="order-data-accordion">

                        {this.renderPayments(store_payments)}

                    </Accordion>

                </Form.Group>

            );

        }

    }


    renderDriverPayments(){

        const { driver_payments } = this.props;

        if(driver_payments.length > 0){

            return(

                <Form.Group>

                    <Form.Label >
                        Driver Payments
                    </Form.Label>

                    <Accordion className="order-data-accordion">

                        {this.renderPayments(driver_payments)}

                    </Accordion>

                </Form.Group>

            );

        }


    }


    show() {

        const {
            initializing_page,
            customer_name,
            customer_user_id,
            store_name,
            store_user_id,
            status,
            ordered_at,
            country,
            total_price,
            total_price_currency,
            store_confirmation_status,
            store_handles_delivery,
            customer_canceled_order,
            delivery_location
        } = this.props;


        const { history  } = this.state;

        if (initializing_page) {

            return (

                <div className="center-container">

                    <div className="spinner-container">

                        <Spinner animation="border" variant="primary"/>

                    </div>

                </div>

            );

        }else{

            return(

                <div className="page-container">


                    <div id="view-order-container">

                        <Card className="view-order-card">

                            <Card.Header
                                as="h5"
                                className="view-order-card-header"
                            >
                                Order Details
                            </Card.Header>


                            <Card.Body>

                                <Form>


                                    <Form.Group>

                                        <div className="order-label-link">

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

                                        <div className="order-label-link">

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


                                    {this.renderDriverDetails()}



                                    <Form.Group>

                                        <Form.Label >
                                            Status
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(status)}
                                        />


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
                                            Total Price
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={`${total_price} ${total_price_currency}`}
                                        />


                                    </Form.Group>


                                    {this.renderDeliveryFee()}


                                    {this.renderOrderType()}



                                    <Form.Group>

                                        <Form.Label >
                                            Store Confirmation Status
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase( store_confirmation_status.split("_").join(" ") )}
                                        />


                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Store Handles Delivery
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={store_handles_delivery ? 'Yes' : 'No' }
                                        />


                                    </Form.Group>



                                    <Form.Group>

                                        <Form.Label >
                                            Customer Canceled Order
                                        </Form.Label>

                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={customer_canceled_order ? 'Yes' : 'No' }
                                        />


                                    </Form.Group>


                                    {this.renderOrderCanceledReason()}


                                    {this.renderStoreFulfilledOrder()}


                                    {this.renderDriverFulfilledOrder()}


                                    {this.renderDeliveryTimeLimit()}


                                    {this.renderStoreArrivalTimeLimit()}


                                    {this.renderConfirmedBy()}


                                    {this.renderCanceledBy()}


                                    {this.renderResolveTimeLimit()}


                                    <Form.Group>

                                        <Form.Label >
                                            Products
                                        </Form.Label>

                                        <Accordion className="order-data-accordion">

                                            {this.renderProducts()}

                                        </Accordion>

                                    </Form.Group>


                                    <Button
                                        variant="outline-primary"
                                        className="order-data-button"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            const latitude = delivery_location.latitude;

                                            const longitude = delivery_location.longitude;

                                            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                                            window.open(url, "_blank");


                                        }}
                                    >
                                        View Delivery Location
                                    </Button>


                                    {this.renderViewReceiptButton()}


                                    {this.renderStorePayments()}


                                    {this.renderDriverPayments()}

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
        roles
    } = state.login;


    const {
        initializing_page,
        products,
        driver_id,
        driver_name,
        status,
        delivery_location,
        ordered_at,
        store_user_id,
        store_name,
        customer_user_id,
        customer_name,
        country,
        delivery_fee,
        delivery_fee_currency,
        order_type,
        store_confirmation_status,
        store_handles_delivery,
        customer_canceled_order,
        order_canceled_reason,
        store_fulfilled_order,
        driver_fulfilled_order,
        total_price,
        total_price_currency,
        delivery_time_limit,
        store_arrival_time_limit,
        receipt_url,
        confirmed_by,
        canceled_by,
        resolve_time_limit,
        store_payments,
        driver_payments
    } = state.view_order;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        products,
        driver_id,
        driver_name,
        status,
        delivery_location,
        ordered_at,
        store_user_id,
        store_name,
        customer_user_id,
        customer_name,
        country,
        delivery_fee,
        delivery_fee_currency,
        order_type,
        store_confirmation_status,
        store_handles_delivery,
        customer_canceled_order,
        order_canceled_reason,
        store_fulfilled_order,
        driver_fulfilled_order,
        total_price,
        total_price_currency,
        delivery_time_limit,
        store_arrival_time_limit,
        receipt_url,
        confirmed_by,
        canceled_by,
        resolve_time_limit,
        store_payments,
        driver_payments
    };

};

export default connect(mapStateToProps, {
    initializeViewOrderPage,
    clearViewOrderState
})(ViewOrder);