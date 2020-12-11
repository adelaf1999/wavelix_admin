import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeStoreAccountsPage,
    clearStoreAccountsState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";

class StoreAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }

    componentWillUnmount(){
        this.props.clearStoreAccountsState();
    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            limit,
            initializeStoreAccountsPage
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            initializeStoreAccountsPage(limit, access_token, client, uid, history);

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


    accountStatusOptions(){

        const { account_status_options } = this.props;

        let options = [];

        options.push({ label: 'Select Status', value: ''});

        _.map(account_status_options, (label, value) => {

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

    reviewStatusOptions(){

        const { review_status_options } = this.props;

        let options = [];

        options.push({ label: 'Select Status', value: ''});

        _.map(review_status_options, (label, value) => {

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


    renderAccounts(){

        const { store_accounts } = this.props;

        return _.map(store_accounts, (store_account, index) => {

            console.log(store_account);

            return(

                <tr key={index}>

                    <td >

                        {store_account.store_username}

                    </td>

                    <td >

                        {store_account.store_name }

                    </td>

                    <td >

                        {store_account.store_owner}

                    </td>

                    <td >

                        {store_account.country}

                    </td>

                    <td >

                        {_.startCase(store_account.account_status)}

                    </td>

                    <td >

                        {_.startCase(store_account.review_status)}

                    </td>

                    <td >

                        {store_account.registered_at}

                    </td>

                    <td>


                        <Button
                            variant="link"
                        >
                            View
                        </Button>

                    </td>

                </tr>

            );

        });

    }

    renderStores(){


        const { store_accounts } = this.props;


        if(store_accounts.length === 0){

            return(


                <div className="center-container">

                    <p className="no-accounts-notice">No Accounts Found</p>

                </div>

            );

        }else{

            return(

                <Table striped bordered hover>

                    <thead>

                    <tr>
                        <th>Store Username</th>
                        <th>Store Name</th>
                        <th>Store Owner</th>
                        <th>Country</th>
                        <th>Account Status</th>
                        <th>Review Status</th>
                        <th>Registered At</th>
                        <th></th>
                    </tr>

                    </thead>

                    <tbody>


                        {this.renderAccounts()}


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
                            placeholder="Search by store username, store owner name or store name"
                            className="mr-sm-2"
                            id="searchbar"
                        />

                    </Form>


                    <Form id="store-accounts-filters-container">


                        <Form.Group className="store-account-filter-group" >

                            <Form.Label>Country</Form.Label>

                            <Form.Control
                                as="select"
                            >

                                {this.getCountries()}

                            </Form.Control>

                        </Form.Group>


                        <Form.Group className="store-account-filter-group" >

                            <Form.Label>Account Status</Form.Label>

                            <Form.Control
                                as="select"
                            >

                                {this.accountStatusOptions()}

                            </Form.Control>

                        </Form.Group>



                        <Form.Group className="store-account-filter-group" >

                            <Form.Label>Review Status</Form.Label>

                            <Form.Control
                                as="select"
                            >

                                {this.reviewStatusOptions()}

                            </Form.Control>

                        </Form.Group>


                    </Form>


                    {this.renderStores()}



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
        store_accounts,
        account_status_options,
        review_status_options,
        countries
    } = state.store_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        initializing_page,
        limit,
        store_accounts,
        account_status_options,
        review_status_options,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeStoreAccountsPage,
    clearStoreAccountsState
})(StoreAccounts);
