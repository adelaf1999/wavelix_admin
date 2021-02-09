import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    initializeDriverUnsuccessfulOrdersPage,
    clearDriverUnsuccessfulOrdersState,
    driverUnsuccessfulOrdersResolversChanged
} from "../actions";
import {  Spinner } from "react-bootstrap";
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

        this.state = {
            history,
            params,
            cable,
            view_driver_unsuccessful_orders_channel_subscription
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
            driverUnsuccessfulOrdersResolversChanged
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

                        }
                    }
                );

                this.setState({view_driver_unsuccessful_orders_channel_subscription: view_driver_unsuccessful_orders_channel_subscription});

            }


        }

    }


    show(){

        const  {
            initializing_page
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
    driverUnsuccessfulOrdersResolversChanged
})(DriverUnsuccessfulOrders);