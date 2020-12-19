import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeDriverAccountsPage,
    clearDriverAccountsPage
} from "../actions";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";
import _ from "lodash";

class DriverAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const driver_verified = null;

        const account_blocked = null;

        const selected_country = null;

        this.state = {
            history,
            search,
            driver_verified,
            account_blocked,
            selected_country
        };

    }

    componentWillUnmount(){

        this.props.clearDriverAccountsPage();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            limit,
            initializeDriverAccountsPage
        } = this.props;


        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        }else{

            initializeDriverAccountsPage(limit, access_token, client, uid, history);

        }


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

                    <Form id="driver-accounts-filters-container">


                        <Form.Group className="driver-account-filter-group" >

                            <Form.Label>Verified</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_driver_verified = e.target.value;

                                    if(_.isBoolean(new_driver_verified)){

                                        this.setState({driver_verified: new_driver_verified});

                                    }else{

                                        this.setState({driver_verified: null});
                                    }



                                }}
                            >

                                <option
                                    value=""
                                >
                                    Select option
                                </option>


                                <option
                                    value={true}
                                >
                                    Yes
                                </option>


                                <option
                                    value={false}
                                >
                                    No
                                </option>

                            </Form.Control>


                        </Form.Group>



                        <Form.Group className="driver-account-filter-group" >

                            <Form.Label>Account Blocked</Form.Label>


                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_account_blocked = e.target.value;

                                    if(_.isBoolean(new_account_blocked)){

                                        this.setState({account_blocked: new_account_blocked});

                                    }else{

                                        this.setState({account_blocked: null});
                                    }



                                }}
                            >

                                <option
                                    value=""
                                >
                                    Select option
                                </option>


                                <option
                                    value={true}
                                >
                                    Yes
                                </option>


                                <option
                                    value={false}
                                >
                                    No
                                </option>


                            </Form.Control>



                        </Form.Group>


                        <Form.Group className="driver-account-filter-group" >

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
        logged_in
    } = state.login;

    const {
        initializing_page,
        limit,
        driver_accounts,
        review_status_options,
        countries
    } = state.driver_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        initializing_page,
        limit,
        driver_accounts,
        review_status_options,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeDriverAccountsPage,
    clearDriverAccountsPage
})(DriverAccounts);
