import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getCustomerAccounts,
    clearCustomerAccountsState,
    searchCustomers,
    searchCustomerAccountsLimitChanged
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";


class CustomerAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            history,
            search
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
                limit,
                searchCustomerAccountsLimitChanged,
                access_token,
                client,
                uid,
                searchCustomers
            } = this.props;

            const { search,  history } = this.state;

            const new_limit = limit + 50;

            searchCustomerAccountsLimitChanged(new_limit);

            searchCustomers(new_limit, search, access_token, client, uid, history);

        }
    }

    componentWillUnmount(){

        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearCustomerAccountsState();

    }

    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

        const {
            logged_in,
            access_token,
            client,
            uid,
            limit,
            getCustomerAccounts
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            getCustomerAccounts(limit, access_token, client, uid, history);

        }


    }


    renderAccounts(){

        const {customer_accounts} = this.props;

        const { history } = this.state;

        return _.map(customer_accounts, (customer_account, index) => {

            return(

                <tr key={index}>

                    <td>
                        {customer_account.full_name}
                    </td>


                    <td>
                        {customer_account.email}
                    </td>

                    <td>
                        {customer_account.username}
                    </td>


                    <td>
                        {customer_account.phone_number}
                    </td>

                    <td>
                        {customer_account.country}
                    </td>

                    <td>

                        <Button
                            variant="link"
                            onClick={() => {
                                history.push(`/customer-accounts/customer_user_id=${customer_account.id}`);
                            }}
                        >
                            View
                        </Button>

                    </td>




                </tr>

            );

        });


    }

    renderCustomerAccounts(){

        const { customer_accounts } = this.props;

        if(customer_accounts.length === 0){

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
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Phone Number</th>
                        <th>Country</th>
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
            access_token,
            client,
            uid,
            limit,
            searchCustomers
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

                    <Form id="customer-accounts-searchbar" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by name, username or phone number"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                searchCustomers(limit, new_search, access_token, client, uid, history);

                            }}
                        />

                    </Form>


                    {this.renderCustomerAccounts()}


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
        customer_accounts,
        limit
    } = state.customer_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        initializing_page,
        customer_accounts,
        limit
    };

};


export default connect(mapStateToProps, {
    getCustomerAccounts,
    clearCustomerAccountsState,
    searchCustomers,
    searchCustomerAccountsLimitChanged
})(CustomerAccounts);



