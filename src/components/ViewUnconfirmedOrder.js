import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getUnconfirmedOrder,
    clearViewUnconfirmedOrderState,
    unconfirmedOrderReviewersChanged
} from "../actions";
import {  Spinner  } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
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


    show(){

        const  {
            initializing_page
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