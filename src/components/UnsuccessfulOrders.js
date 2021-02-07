import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeUnsuccessfulOrdersPage,
    clearUnsuccessfulOrdersState
} from "../actions";
import {  Spinner, Form, FormControl, Table, Button, Alert } from "react-bootstrap";
import _ from "lodash";
import Timer from 'react-compound-timer'

class UnsuccessfulOrders extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const search = "";

        const selected_country = null;

        this.state = {
            history,
            search,
            selected_country
        };

    }


    componentWillUnmount(){

        this.props.clearUnsuccessfulOrdersState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeUnsuccessfulOrdersPage
        } = this.props;

        const {
            history
        } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            initializeUnsuccessfulOrdersPage(access_token, client, uid, history);

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

                    <p className="no-accounts-notice">No Drivers Found</p>

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

                    <Form className="searchbar-container" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by driver name"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});


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
    clearUnsuccessfulOrdersState
})(UnsuccessfulOrders);