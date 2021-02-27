import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    initializeEarningsPage,
    clearEarningsPageState,
    getYearEarnings
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



    yearFilter(){

        const { years, getYearEarnings, access_token, client, uid} = this.props;

        const { history } = this.state;

        if(years.length > 0){

            return(

                <Form id="earnings-filter-container">

                    <Form.Group className="orders-filter-group" >

                        <Form.Label>Year</Form.Label>

                        <Form.Control
                            as="select"
                            onChange={(e) => {

                                const new_selected_year = e.target.value;

                                console.log(new_selected_year);

                                getYearEarnings(access_token, client, uid, history, new_selected_year);


                            }}
                        >

                            {
                                _.map(years, (year, index) => {


                                    return(

                                        <option
                                            key={index}
                                            value={year}
                                        >
                                            {year}
                                        </option>

                                    );

                                })

                            }

                        </Form.Control>

                    </Form.Group>

                </Form>


            );

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

                    {this.yearFilter()}

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
    clearEarningsPageState,
    getYearEarnings
})(Earnings);