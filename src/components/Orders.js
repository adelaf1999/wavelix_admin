import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeOrdersPage,
    clearOrdersPageState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl } from "react-bootstrap";

class Orders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const store_name = "";

        const customer_name = "";

        const selected_status = null;

        const selected_country = null;

        const selected_store_handles_delivery = null;

        this.state = {
            history,
            store_name,
            customer_name,
            selected_status,
            selected_country,
            selected_store_handles_delivery
        };

    }

    componentWillUnmount(){

        this.props.clearOrdersPageState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            limit,
            initializeOrdersPage,
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        } else if( !roles.includes("root_admin") ){

            history.push("/home");

        } else{

            initializeOrdersPage(access_token, client, uid, history, limit);

        }

    }

    statusOptions(){

        const { status_options } = this.props;

        let options = [];

        options.push({ label: 'Select Option', value: ''});

        _.map(status_options, (value, label) => {

            options.push({
                label: _.startCase(label),
                value: value
            });

        });


        return _.map(options, (option, index) => {


            return(

                <option
                    key={index}
                    value={option.value}
                >
                    {option.label}
                </option>

            );

        });


    }


    getCountries(){

        const { countries } = this.props;

        let country_options = [];

        country_options.push({ label: 'Select Option', value: ''});

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


    show(){

        const {
            initializing_page,
            limit,
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


                    <Form id="orders-search-inputs-container">


                        <Form.Group className="orders-search-input-container">

                            <Form.Label>
                                Store Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="store name"
                                className="orders-search-input"
                                onChange={(e) => {
                                    this.setState({store_name: e.target.value});
                                }}
                            />

                        </Form.Group>


                        <Form.Group className="orders-search-input-container">

                            <Form.Label>
                                Customer Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="customer name"
                                className="orders-search-input"
                                onChange={(e) => {
                                    this.setState({customer_name: e.target.value});
                                }}
                            />

                        </Form.Group>

                    </Form>


                    <Form id="orders-filters-container">


                        <Form.Group className="orders-filter-group" >

                            <Form.Label>Status</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_status = e.target.value;

                                    if(_.isEmpty(new_selected_status)){

                                        this.setState({selected_status: null});

                                    }else{

                                        this.setState({selected_status: new_selected_status});
                                    }

                                }}
                            >

                                {this.statusOptions()}

                            </Form.Control>

                        </Form.Group>


                        <Form.Group className="orders-filter-group" >

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



                        <Form.Group className="orders-filter-group" >

                            <Form.Label>Store handles delivery</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const selected_option = parseInt(e.target.value);

                                    let new_selected_store_handles_delivery;

                                    if(selected_option === -1){

                                        new_selected_store_handles_delivery = "";


                                        this.setState({selected_store_handles_delivery: null});


                                    }else if(selected_option === 0){

                                        new_selected_store_handles_delivery = false;


                                        this.setState({selected_store_handles_delivery: false});


                                    }else{

                                        new_selected_store_handles_delivery = true;


                                        this.setState({selected_store_handles_delivery: true});


                                    }




                                }}
                            >

                                <option
                                    value={-1}
                                >
                                    Select Option
                                </option>


                                <option
                                    value={0}
                                >
                                    No
                                </option>

                                <option
                                    value={1}
                                >
                                    Yes
                                </option>





                            </Form.Control>

                        </Form.Group>



                    </Form>


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
        limit,
        orders,
        status_options,
        countries
    } = state.orders;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        limit,
        orders,
        status_options,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeOrdersPage,
    clearOrdersPageState
})(Orders);