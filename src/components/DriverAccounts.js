import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeDriverAccountsPage,
    clearDriverAccountsPage
} from "../actions";
import {  Spinner, Form, FormControl, Button, Table, Image} from "react-bootstrap";
import _ from "lodash";

class DriverAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const driver_verified = null;

        const account_blocked = null;

        const selected_country = null;

        const selected_review_status = null;

        this.state = {
            history,
            search,
            driver_verified,
            account_blocked,
            selected_country,
            selected_review_status
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
    clearDriverAccountsPage
})(DriverAccounts);
