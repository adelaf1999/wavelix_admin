import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeDriverAccountsPage,
    clearDriverAccountsPage,
    searchDriverAccounts,
    driverAccountsChanged,
    searchDriverAccountsLimitChanged
} from "../actions";
import {  Spinner, Form, FormControl, Button, Table, Image} from "react-bootstrap";
import _ from "lodash";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class DriverAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const driver_verified = null;

        const account_blocked = null;

        const selected_country = null;

        const selected_review_status = null;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const driver_accounts_channel_subscription = null;

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            history,
            search,
            driver_verified,
            account_blocked,
            selected_country,
            selected_review_status,
            cable,
            driver_accounts_channel_subscription
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

            const {
                searchDriverAccounts,
                searchDriverAccountsLimitChanged,
                limit,
                access_token,
                client,
                uid
            } = this.props;


            const {
                search,
                driver_verified,
                selected_country,
                account_blocked,
                selected_review_status,
                history
            } = this.state;

            const new_limit = limit + 50;

            searchDriverAccountsLimitChanged(new_limit);

            searchDriverAccounts(
                new_limit,
                search,
                driver_verified,
                selected_country,
                account_blocked,
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

        const driver_accounts_channel_subscription = this.state.driver_accounts_channel_subscription;

        if(driver_accounts_channel_subscription !== null){

            cable.subscriptions.remove(driver_accounts_channel_subscription);

        }

        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearDriverAccountsPage();

    }

    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

        const {
            logged_in,
            access_token,
            client,
            uid,
            limit,
            initializeDriverAccountsPage,
            driverAccountsChanged
        } = this.props;


        const { history, cable } = this.state;

        if(!logged_in){

            history.push("/");

        }else{

            initializeDriverAccountsPage(limit, access_token, client, uid, history);

            let driver_accounts_channel_subscription = this.state.driver_accounts_channel_subscription;

            if(driver_accounts_channel_subscription === null){

                driver_accounts_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'DriverAccountsChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid
                    },
                    {
                        connected: () => {

                            console.log('DriverAccountsChannel Connected!');

                        },
                        received: (data) => {

                            console.log("DriverAccountsChannel Received!");

                            console.log(data);

                            if(data.new_driver_registered){

                                const {
                                    searchDriverAccounts,
                                    limit,
                                    access_token,
                                    client,
                                    uid
                                } = this.props;


                                const {
                                    search,
                                    driver_verified,
                                    selected_country,
                                    account_blocked,
                                    selected_review_status,
                                    history
                                } = this.state;

                                searchDriverAccounts(
                                    limit,
                                    search,
                                    driver_verified,
                                    selected_country,
                                    account_blocked,
                                    selected_review_status,
                                    access_token,
                                    client,
                                    uid,
                                    history
                                );


                            }


                            if(data.driver_account_item !== undefined){

                                console.log("New driver account item received");

                                const driver_account_item = data.driver_account_item;

                                let driver_accounts = _.cloneDeep(this.props.driver_accounts);

                                const driver_account_index = _.findIndex(driver_accounts, { id: driver_account_item.id });

                                if(driver_account_index !== -1){

                                    driver_accounts[driver_account_index] = driver_account_item;

                                    console.log(driver_accounts);

                                    driverAccountsChanged(driver_accounts);

                                }



                            }


                        }
                    }
                );

                this.setState({driver_accounts_channel_subscription: driver_accounts_channel_subscription});

            }


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


    reviewStatusOptions(){

        const { review_status_options } = this.props;

        let options = [];

        options.push({ label: 'Select Option', value: ''});

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

        const { driver_accounts } = this.props;

        return _.map(driver_accounts, (driver_account, index) => {

            return(

                <tr key={index}>

                    <td >

                        <Image
                            src={driver_account.profile_picture}
                            thumbnail
                            id="driver-profile-picture"
                        />

                    </td>

                    <td>
                        {driver_account.name}
                    </td>

                    <td>
                        {driver_account.country}
                    </td>

                    <td>
                        {driver_account.driver_verified ? 'Yes' : 'No'}
                    </td>

                    <td>
                        {driver_account.account_blocked ? 'Yes' : 'No'}
                    </td>

                    <td>
                        {_.startCase(driver_account.review_status)}
                    </td>

                    <td>
                        {driver_account.registered_at}
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

    renderDrivers(){

        const { driver_accounts } = this.props;

        if(driver_accounts.length === 0){

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

                        <th>Profile Picture</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Verified</th>
                        <th>Account Blocked</th>
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
            searchDriverAccounts,
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


                    <Form className="searchbar-container" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by driver name"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                const {
                                    driver_verified,
                                    account_blocked,
                                    selected_country,
                                    selected_review_status
                                } = this.state;

                                searchDriverAccounts(
                                    limit,
                                    new_search,
                                    driver_verified,
                                    selected_country,
                                    account_blocked,
                                    selected_review_status,
                                    access_token,
                                    client,
                                    uid,
                                    history
                                );

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

                                    if( new_driver_verified === "true" || new_driver_verified === "false"){

                                        this.setState({driver_verified: new_driver_verified});

                                    }else{


                                        this.setState({driver_verified: null});
                                    }

                                    const {
                                        search,
                                        account_blocked,
                                        selected_country,
                                        selected_review_status
                                    } = this.state;

                                    searchDriverAccounts(
                                        limit,
                                        search,
                                        new_driver_verified,
                                        selected_country,
                                        account_blocked,
                                        selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );


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

                                    if(new_account_blocked === "true" || new_account_blocked === "false"){

                                        this.setState({account_blocked: new_account_blocked});

                                    }else{

                                        this.setState({account_blocked: null});
                                    }


                                    const {
                                        search,
                                        driver_verified,
                                        selected_country,
                                        selected_review_status
                                    } = this.state;


                                    searchDriverAccounts(
                                        limit,
                                        search,
                                        driver_verified,
                                        selected_country,
                                        new_account_blocked,
                                        selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );



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

                                    const {
                                        search,
                                        driver_verified,
                                        account_blocked,
                                        selected_review_status
                                    } = this.state;


                                    searchDriverAccounts(
                                        limit,
                                        search,
                                        driver_verified,
                                        new_selected_country,
                                        account_blocked,
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



                        <Form.Group className="driver-account-filter-group" >

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


                                    const {
                                        search,
                                        driver_verified,
                                        account_blocked,
                                        selected_country
                                    } = this.state;


                                    searchDriverAccounts(
                                        limit,
                                        search,
                                        driver_verified,
                                        selected_country,
                                        account_blocked,
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


                    {this.renderDrivers()}


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
    clearDriverAccountsPage,
    searchDriverAccounts,
    driverAccountsChanged,
    searchDriverAccountsLimitChanged
})(DriverAccounts);
