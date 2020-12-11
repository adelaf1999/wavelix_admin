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
