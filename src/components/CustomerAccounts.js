import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getCustomerAccounts,
    clearCustomerAccountsState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";


class CustomerAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }

    componentWillUnmount(){

        this.props.clearCustomerAccountsState();

    }

    componentDidMount(){

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

    show(){

        const { initializing_page } = this.props;

        if(initializing_page){

            return(

                <div className="center-container">

                    <div className="spinner-container">

                        <Spinner animation="border" variant="primary" />

                    </div>

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
    clearCustomerAccountsState
})(CustomerAccounts);



