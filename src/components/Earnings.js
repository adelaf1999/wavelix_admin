import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeEarningsPage,
    clearEarningsPageState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form,  Button, Table } from "react-bootstrap";

class Earnings extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }


    componentWillUnmount(){
        this.props.clearEarningsPageState();

    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            limit,
            initializeEarningsPage,
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        } else if( !roles.includes("root_admin") ){

            history.push("/home");

        } else{

            initializeEarningsPage(access_token, client, uid, history, limit);

        }

    }


    show() {

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
        logged_in,
        roles
    } = state.login;

    const {
        initializing_page,
        earnings,
        years,
        total
    } = state.earnings;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        earnings,
        years,
        total
    };

};

export default connect(mapStateToProps, {
    initializeEarningsPage,
    clearEarningsPageState
})(Earnings);