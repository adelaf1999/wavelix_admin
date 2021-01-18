import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeUnconfirmedOrdersPage,
    clearUnconfirmedOrdersState,
    searchUnconfirmedOrders,
    unconfirmedOrdersChanged
} from "../actions";
import {  Spinner, Form, FormControl, Table, Button } from "react-bootstrap";
import _ from "lodash";
import Timer from 'react-compound-timer'
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class UnconfirmedOrders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const selected_country = null;

        const selected_time_exceeded = null;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const unconfirmed_orders_channel_subscription = null;

        this.state = {
            history,
            search,
            selected_country,
            selected_time_exceeded,
            cable,
            unconfirmed_orders_channel_subscription
        };

    }


    componentWillUnmount(){

        const cable = this.state.cable;

        const unconfirmed_orders_channel_subscription = this.state.unconfirmed_orders_channel_subscription;

        if(unconfirmed_orders_channel_subscription !== null){

            cable.subscriptions.remove(unconfirmed_orders_channel_subscription);

        }


        this.props.clearUnconfirmedOrdersState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeUnconfirmedOrdersPage,
            searchUnconfirmedOrders,
            unconfirmedOrdersChanged
        } = this.props;

        const {
            history,
            cable,
            search,
            selected_country,
            selected_time_exceeded
        } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            initializeUnconfirmedOrdersPage(access_token, client, uid, history);

            let unconfirmed_orders_channel_subscription = this.state.unconfirmed_orders_channel_subscription;

            if(unconfirmed_orders_channel_subscription === null){

                unconfirmed_orders_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'UnconfirmedOrdersChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid
                    },
                    {
                        connected: () => {

                            console.log('UnconfirmedOrdersChannel Connected!');

                        },
                        received: (data) => {

                            console.log("UnconfirmedOrdersChannel Received!");

                            console.log(data);

                            if(data.new_unconfirmed_order){

                                searchUnconfirmedOrders(access_token, client, uid, history, search, selected_country, selected_time_exceeded);
                            }

                            if(data.order_confirmed && data.order_id !== undefined){

                                const order_id = data.order_id;

                                let unconfirmed_orders = _.cloneDeep(this.props.unconfirmed_orders);

                                _.remove(unconfirmed_orders, function(order) {
                                    return order.id === order_id;
                                });

                                unconfirmedOrdersChanged(unconfirmed_orders);

                            }


                        }
                    }
                );

                this.setState({unconfirmed_orders_channel_subscription: unconfirmed_orders_channel_subscription});

            }


        }

    }


    getCountries(){

        const { countries } = this.props;

        let country_options = [];

        country_options.push({ label: 'Select Country', value: ''});

        _.map(countries, (country_name, country_code) => {


            country_options.push({
                label: country_name,
                value: country_code
            });

        });


        return _.map(country_options, (country, index) => {


            return(

                <option
                    key={index}
                    value={country.value}
                >
                    {country.label}
                </option>

            );

        });

    }

    timeExceededOptions(){

        const { time_exceeded_filters } = this.props;

        let time_exceeded_options = [];

        time_exceeded_options.push({ label: 'Select Option', value: ''});

        _.map(time_exceeded_filters, (time_label, time_value) => {

            time_exceeded_options.push({
                label: time_label,
                value: time_value
            });

        });

        return _.map(time_exceeded_options, (time_option, index) => {


            return(

                <option
                    key={index}
                    value={time_option.value}
                >
                    {time_option.label}
                </option>

            );

        });

    }


    renderOrders(){

        const { unconfirmed_orders } = this.props;

        const { history } = this.state;

        return _.map(unconfirmed_orders, (order, index) => {

            const delivery_time_limit = new Date(order.delivery_time_limit).getTime();

            const current_time = new Date().getTime();

            const initial_time = ( current_time - delivery_time_limit );


            return(

                <tr key={index}>

                    <td>
                        {order.store_name}
                    </td>

                    <td>
                        {order.store_has_sensitive_products ? 'Yes' : 'No'}
                    </td>

                    <td>
                        {order.customer_name}
                    </td>

                    <td>
                        {order.country}
                    </td>


                    <td>

                        <Timer
                            initialTime={initial_time}
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

                    </td>

                    <td>
                        {order.ordered_at}
                    </td>

                    <td>

                        <Button
                            variant="link"
                            onClick={(e) => {

                                e.preventDefault();

                                history.push(`/unconfirmed-orders/order_id=${order.id}`);

                            }}
                        >
                            View
                        </Button>

                    </td>


                </tr>

            );

        });

    }

    renderUnconfirmedOrders(){

        const { unconfirmed_orders } = this.props;

        if(unconfirmed_orders.length === 0){

            return(

                <div className="center-container">

                    <p className="no-accounts-notice">No Unconfirmed Orders Found</p>

                </div>

            );

        }else{

            return(

                <Table striped bordered hover>

                    <thead>

                        <tr>

                            <th>Store Name</th>
                            <th>Food Service</th>
                            <th>Customer Name</th>
                            <th>Country</th>
                            <th>Time Exceeded</th>
                            <th>Ordered At</th>
                            <th></th>

                        </tr>

                    </thead>


                    <tbody>

                        {this.renderOrders()}

                    </tbody>

                </Table>

            );

        }

    }

    show(){

        const {
            initializing_page,
            searchUnconfirmedOrders,
            access_token,
            client,
            uid
        } = this.props;

        const { history } = this.state;

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

                    <Form className="searchbar-container" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by store name or customer name"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                const { selected_country, selected_time_exceeded } = this.state;

                                searchUnconfirmedOrders(access_token, client, uid, history, new_search, selected_country, selected_time_exceeded);

                            }}
                        />

                    </Form>

                    <Form id="unconfirmed-orders-filters-container">



                        <Form.Group className="unconfirmed-order-filter-group" >

                            <Form.Label>Country</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_country = e.target.value;

                                    if(_.isEmpty(new_selected_country)){

                                        this.setState({selected_country: null});

                                    }else{

                                        this.setState({selected_country: new_selected_country});
                                    }


                                    const { selected_time_exceeded, search } = this.state;


                                    searchUnconfirmedOrders(access_token, client, uid, history, search, new_selected_country, selected_time_exceeded);

                                }}
                            >

                                {this.getCountries()}

                            </Form.Control>


                        </Form.Group>


                        <Form.Group className="unconfirmed-order-filter-group" >

                            <Form.Label>Time Exceeded</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_time_exceeded = e.target.value;

                                    if(_.isEmpty(new_selected_time_exceeded)){

                                        this.setState({selected_time_exceeded: null});

                                    }else{

                                        this.setState({selected_time_exceeded: new_selected_time_exceeded});
                                    }

                                    const { search, selected_country } = this.state;

                                    searchUnconfirmedOrders(access_token, client, uid, history, search, selected_country, new_selected_time_exceeded);


                                }}
                            >

                                {this.timeExceededOptions()}

                            </Form.Control>

                        </Form.Group>


                    </Form>

                    {this.renderUnconfirmedOrders()}

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

                    <TopHeader
                        history={this.state.history}
                    />

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
        time_exceeded_filters,
        unconfirmed_orders,
        countries
    } = state.unconfirmed_orders;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        time_exceeded_filters,
        unconfirmed_orders,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeUnconfirmedOrdersPage,
    clearUnconfirmedOrdersState,
    searchUnconfirmedOrders,
    unconfirmedOrdersChanged
})(UnconfirmedOrders);