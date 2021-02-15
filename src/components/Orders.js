import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeOrdersPage,
    clearOrdersPageState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl } from "react-bootstrap";

class Orders extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const store_name = "";

        const customer_name = "";

        this.state = {
            history,
            store_name,
            customer_name
        };

    }

    componentWillUnmount(){

        this.props.clearOrdersPageState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            limit,
            initializeOrdersPage,
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        } else if( !roles.includes("root_admin") ){

            history.push("/home");

        } else{

            initializeOrdersPage(access_token, client, uid, history, limit);

        }

    }


    show(){

        const {
            initializing_page,
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


                    <Form id="orders-search-inputs-container">


                        <Form.Group className="orders-search-input-container">

                            <Form.Label>
                                Store Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="store name"
                                className="orders-search-input"
                                onChange={(e) => {
                                    this.setState({store_name: e.target.value});
                                }}
                            />

                        </Form.Group>


                        <Form.Group className="orders-search-input-container">

                            <Form.Label>
                                Customer Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="customer name"
                                className="orders-search-input"
                                onChange={(e) => {
                                    this.setState({customer_name: e.target.value});
                                }}
                            />

                        </Form.Group>

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
        logged_in,
        roles
    } = state.login;

    const {
        initializing_page,
        limit,
        orders,
        status_options,
        countries
    } = state.orders;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        limit,
        orders,
        status_options,
        countries
    };

};

export default connect(mapStateToProps, {
    initializeOrdersPage,
    clearOrdersPageState
})(Orders);