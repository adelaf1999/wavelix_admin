import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    initializeViewOrderPage,
    clearViewOrderState
} from "../actions";
import _ from "lodash";
import {  Spinner } from "react-bootstrap";

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

    show() {

        const {
            initializing_page
        } = this.props;


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