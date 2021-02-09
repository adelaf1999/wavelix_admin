import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeUnsuccessfulOrdersPage,
    clearUnsuccessfulOrdersState,
    searchDriversUnsuccessfulOrders,
    driversUnsuccessfulOrdersChanged
} from "../actions";
import {  Spinner, Form, FormControl, Table, Button, Alert } from "react-bootstrap";
import _ from "lodash";
import Timer from 'react-compound-timer'
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class UnsuccessfulOrders extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const search = "";

        const selected_country = null;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const unsuccessful_orders_channel_subscription = null;

        this.state = {
            history,
            search,
            selected_country,
            cable,
            unsuccessful_orders_channel_subscription
        };

    }


    componentWillUnmount(){

        const cable = this.state.cable;

        const unsuccessful_orders_channel_subscription = this.state.unsuccessful_orders_channel_subscription;

        if(unsuccessful_orders_channel_subscription !== null){

            cable.subscriptions.remove(unsuccessful_orders_channel_subscription);

        }


        this.props.clearUnsuccessfulOrdersState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeUnsuccessfulOrdersPage,
            searchDriversUnsuccessfulOrders,
            driversUnsuccessfulOrdersChanged
        } = this.props;

        const {
            history,
            cable
        } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            initializeUnsuccessfulOrdersPage(access_token, client, uid, history);


            let unsuccessful_orders_channel_subscription = this.state.unsuccessful_orders_channel_subscription;

            if(unsuccessful_orders_channel_subscription === null){

                unsuccessful_orders_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'UnsuccessfulOrdersChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid
                    },
                    {
                        connected: () => {

                            console.log('UnsuccessfulOrdersChannel Connected!');

                        },
                        received: (data) => {

                            console.log("UnsuccessfulOrdersChannel Received!");

                            console.log(data);

                            if(data.new_driver){

                                const { search, selected_country } = this.state;

                                searchDriversUnsuccessfulOrders(access_token, client, uid, history, search, selected_country);

                            }


                            if(data.delete_driver && data.driver_id !== undefined ){

                                const driver_id = data.driver_id;

                                let drivers = _.cloneDeep(this.props.drivers);

                                _.remove(drivers, function(driver) {
                                    return driver.id === driver_id;
                                });

                                driversUnsuccessfulOrdersChanged(drivers);

                            }


                        }
                    }
                );

                this.setState({unsuccessful_orders_channel_subscription: unsuccessful_orders_channel_subscription});


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

    renderDrivers(){

        const { drivers } = this.props;

        const { history } = this.state;

        return _.map(drivers, (driver, index) => {



            const next_order_resolve_time_limit = new Date(driver.next_order_resolve_time_limit).getTime();

            const current_time = new Date().getTime();

            const time_passed = next_order_resolve_time_limit - current_time;

            const initial_time =  time_passed  < 0 ? 0 : time_passed;


            return(

                <tr key={index}>

                    <td>
                        {driver.name}
                    </td>

                    <td>
                        {driver.country}
                    </td>

                    <td>

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

                    </td>

                    <td>

                        <Button
                            variant="link"
                            onClick={(e) => {

                                e.preventDefault();

                                history.push(`/unsuccessful-orders/driver_id=${driver.id}`);

                            }}
                        >
                            View
                        </Button>

                    </td>

                </tr>

            );

        });


    }

    renderDriverAccounts(){

        const { drivers } = this.props;

        if(drivers.length === 0){

            return(

                <div className="center-container">

                    <p id="no-driver-accounts-notice">No Drivers Found</p>

                </div>

            );

        }else{

            return(

                <Table striped bordered hover>

                    <thead>

                    <tr>

                        <th>Driver Name</th>
                        <th>Country</th>
                        <th>Time Left To Resolve Next Order</th>
                        <th></th>

                    </tr>

                    </thead>


                    <tbody>

                        {this.renderDrivers()}

                    </tbody>

                </Table>

            );

        }

    }

    show(){

        const {
            initializing_page,
            searchDriversUnsuccessfulOrders,
            access_token,
            client,
            uid
        } = this.props;


        const {
            history
        } = this.state;

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
                            placeholder="Search by driver name"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                const { selected_country } = this.state;

                                searchDriversUnsuccessfulOrders(access_token, client, uid, history, new_search, selected_country);


                            }}
                        />

                    </Form>


                    <div id="unsuccessful-orders-warning-container">

                        <Alert variant="warning" id="unsuccessful-orders-warning-text">
                            For orders where the store doesn't provide delivery (i.e. Wavelix drivers will be doing delivery),
                            we only have exactly 7 days to resolve each order from the time the order was accepted
                            by the driver. If the time limit to resolve an order passed and the order was not resolved,
                            and the order had to be canceled, we might not be able to recover the cost of the product(s)
                            for the store from the driver's card if the driver indeed stole them.
                        </Alert>

                    </div>


                    <Form id="unsuccessful-orders-filters-container">

                        <Form.Group className="unsuccessful-order-filter-group" >

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


                                    const { search } = this.state;

                                    searchDriversUnsuccessfulOrders(access_token, client, uid, history, search, new_selected_country);


                                }}
                            >

                                {this.getCountries()}

                            </Form.Control>


                        </Form.Group>

                    </Form>


                    {this.renderDriverAccounts()}





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
        drivers,
        countries
    } = state.unsuccessful_orders;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        drivers,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeUnsuccessfulOrdersPage,
    clearUnsuccessfulOrdersState,
    searchDriversUnsuccessfulOrders,
    driversUnsuccessfulOrdersChanged
})(UnsuccessfulOrders);