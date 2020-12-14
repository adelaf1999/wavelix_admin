import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getStoreData,
    clearViewStoreAccountState,
    storeAccountReviewersChanged
} from "../actions";
import _ from "lodash";
import {  Spinner, Card,  Button, Form, Modal} from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class ViewStoreAccount extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const store_account_channel_subscription = null;

        this.state = {
            history,
            params,
            cable,
            store_account_channel_subscription
        };
    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const store_account_channel_subscription = this.state.store_account_channel_subscription;

        if(store_account_channel_subscription !== null){

            cable.subscriptions.remove(store_account_channel_subscription);

        }

        this.props.clearViewStoreAccountState();

    }

    componentDidMount(){


        const {
            logged_in,
            access_token,
            client,
            uid,
            getStoreData,
            storeAccountReviewersChanged
        } = this.props;

        const { history, params, cable } = this.state;


        if(!logged_in){

            history.push("/");

        }else{

            const store_user_id = params.store_user_id;

            getStoreData(store_user_id, access_token, client, uid, history);

            const cable = this.state.cable;

            let store_account_channel_subscription = this.state.store_account_channel_subscription;

            if(store_account_channel_subscription === null){

                store_account_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'StoreAccountChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        store_user_id: store_user_id
                    },
                    {
                        connected: () => {

                            console.log('StoreAccountChannel Connected!');

                        },
                        received: (data) => {

                            console.log("StoreAccountChannel Received!");

                            console.log(data);

                            if(data.current_reviewers !== undefined){

                                console.log("current reviewers ", data.current_reviewers);

                                storeAccountReviewersChanged(data.current_reviewers);

                            }

                        }
                    }
                );

            }


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
        store_owner,
        store_username,
        store_name,
        status,
        review_status,
        country,
        has_sensitive_products,
        business_license,
        registered_at,
        location,
        store_owner_number,
        store_number,
        verified_by,
        declined_verification,
        current_reviewers
    } = state.view_store_account;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        store_owner,
        store_username,
        store_name,
        status,
        review_status,
        country,
        has_sensitive_products,
        business_license,
        registered_at,
        location,
        store_owner_number,
        store_number,
        verified_by,
        declined_verification,
        current_reviewers
    };


};

export default connect(mapStateToProps, {
    getStoreData,
    clearViewStoreAccountState,
    storeAccountReviewersChanged
})(ViewStoreAccount);
