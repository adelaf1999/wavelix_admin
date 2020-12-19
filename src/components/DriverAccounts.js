import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeDriverAccountsPage,
    clearDriverAccountsPage
} from "../actions";
import {  Spinner, Form, FormControl, Button, Table} from "react-bootstrap";

class DriverAccounts extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        this.state = {
            history,
            search
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
