import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeUnconfirmedOrdersPage,
    clearUnconfirmedOrdersState
} from "../actions";
import {  Spinner } from "react-bootstrap";

class UnconfirmedOrders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }


    componentWillUnmount(){

        this.props.clearUnconfirmedOrdersState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            initializeUnconfirmedOrdersPage
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("order_manager") ){

            history.push("/home");

        }else{

            initializeUnconfirmedOrdersPage(access_token, client, uid, history);

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
        logged_in,
        roles
    } = state.login;

    const {
        initializing_page,
        time_exceeded_filters,
        unconfirmed_orders,
        countries
    } = state.unconfirmed_orders;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        time_exceeded_filters,
        unconfirmed_orders,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeUnconfirmedOrdersPage,
    clearUnconfirmedOrdersState
})(UnconfirmedOrders);