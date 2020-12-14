import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeStoreAccountsPage,
    clearStoreAccountsState,
    searchStoreAccounts,
    searchStoreAccountsLimitChanged
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class StoreAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const selected_country = null;

        const selected_account_status = null;

        const selected_review_status = null;

        this.handleScroll = this.handleScroll.bind(this);

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const store_accounts_channel_subscription = null;

        this.state = {
            history,
            search,
            selected_country,
            selected_account_status,
            selected_review_status,
            cable,
            store_accounts_channel_subscription
        };

    }


    handleScroll() {

        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

        const body = document.body;

        const html = document.documentElement;

        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);

        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight) {

            console.log("bottom reached");

            const {searchStoreAccounts, limit, access_token, client, uid, searchStoreAccountsLimitChanged} = this.props;

            const { search, selected_country, selected_account_status, selected_review_status, history } = this.state;

            const new_limit = limit + 50;

            searchStoreAccountsLimitChanged(new_limit);

            searchStoreAccounts(
                new_limit,
                search,
                selected_country,
                selected_account_status,
                selected_review_status,
                access_token,
                client,
                uid,
                history
            );


        }
    }


    componentWillUnmount(){

        const cable = this.state.cable;

        const store_accounts_channel_subscription = this.state.store_accounts_channel_subscription;

        if(store_accounts_channel_subscription !== null){

            cable.subscriptions.remove(store_accounts_channel_subscription);

        }


        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearStoreAccountsState();

    }

    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

        const {
            logged_in,
            access_token,
            client,
            uid,
            limit,
            initializeStoreAccountsPage
        } = this.props;

        const { history, cable } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            initializeStoreAccountsPage(limit, access_token, client, uid, history);

            let store_accounts_channel_subscription = this.state.store_accounts_channel_subscription;

            if(store_accounts_channel_subscription === null){

                store_accounts_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'StoreAccountsChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid
                    },
                    {
                        connected: () => {

                            console.log('StoreAccountsChannel Connected!');

                        },
                        received: (data) => {

                            console.log("StoreAccountsChannel Received!");

                            console.log(data);

                            if(data.new_store_registered){


                                const { searchStoreAccounts } = this.props;

                                const { search, selected_country, selected_account_status, selected_review_status } = this.state;


                                searchStoreAccounts(
                                    limit,
                                    search,
                                    selected_country,
                                    selected_account_status,
                                    selected_review_status,
                                    access_token,
                                    client,
                                    uid,
                                    history
                                );

                            }

                        }
                    }
                );

                this.setState({store_accounts_channel_subscription: store_accounts_channel_subscription});

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

        const { history } = this.state;

        return _.map(store_accounts, (store_account, index) => {

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
                            onClick={(e) => {
                                e.preventDefault();
                                history.push(`/store-accounts/store_user_id=${store_account.id}`);
                            }}
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
            initializing_page,
            searchStoreAccounts,
            limit,
            access_token,
            client,
            uid
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
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});


                                const { selected_country, selected_account_status, selected_review_status, history } = this.state;

                                searchStoreAccounts(
                                    limit,
                                    new_search,
                                    selected_country,
                                    selected_account_status,
                                    selected_review_status,
                                    access_token,
                                    client,
                                    uid,
                                    history
                                );


                            }}
                        />

                    </Form>


                    <Form id="store-accounts-filters-container">


                        <Form.Group className="store-account-filter-group" >

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


                                    const { search, selected_account_status, selected_review_status, history } = this.state;

                                    searchStoreAccounts(
                                        limit,
                                        search,
                                        new_selected_country,
                                        selected_account_status,
                                        selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );


                                }}
                            >

                                {this.getCountries()}

                            </Form.Control>

                        </Form.Group>


                        <Form.Group className="store-account-filter-group" >

                            <Form.Label>Account Status</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_account_status = e.target.value;

                                    if(_.isEmpty(new_selected_account_status)){

                                        this.setState({selected_account_status: null});

                                    }else{

                                        this.setState({selected_account_status: new_selected_account_status});
                                    }


                                    const { selected_country, search, selected_review_status, history } = this.state;

                                    searchStoreAccounts(
                                        limit,
                                        search,
                                        selected_country,
                                        new_selected_account_status,
                                        selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );

                                }}
                            >

                                {this.accountStatusOptions()}

                            </Form.Control>

                        </Form.Group>



                        <Form.Group className="store-account-filter-group" >

                            <Form.Label>Review Status</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_review_status = e.target.value;

                                    if(_.isEmpty(new_selected_review_status)){

                                        this.setState({selected_review_status: null});

                                    }else{

                                        this.setState({selected_review_status: new_selected_review_status});
                                    }

                                    const { selected_country, selected_account_status, search, history } = this.state;

                                    searchStoreAccounts(
                                        limit,
                                        search,
                                        selected_country,
                                        selected_account_status,
                                        new_selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );


                                }}
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
    clearStoreAccountsState,
    searchStoreAccounts,
    searchStoreAccountsLimitChanged
})(StoreAccounts);
