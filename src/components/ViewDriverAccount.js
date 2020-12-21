import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getDriverData,
    clearViewDriverAccountState,
    driverAccountReviewersChanged,
    driverAccountAdminsDeclinedChanged,
    driverAccountReviewStatusChanged,
    driverAccountUnverifiedReasonsChanged,
    driverAccountDriverVerifiedChanged,
    driverAccountVerifiedByChanged
} from "../actions";
import {  Spinner } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class ViewDriverAccount extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const driver_account_channel_subscription = null;

        this.state = {
            history,
            params,
            cable,
            driver_account_channel_subscription
        };

    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const driver_account_channel_subscription = this.state.driver_account_channel_subscription;

        if(driver_account_channel_subscription !== null){

            cable.subscriptions.remove(driver_account_channel_subscription);

        }

        this.props.clearViewDriverAccountState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            getDriverData,
            driverAccountReviewersChanged,
            driverAccountAdminsDeclinedChanged,
            driverAccountReviewStatusChanged,
            driverAccountUnverifiedReasonsChanged,
            driverAccountDriverVerifiedChanged,
            driverAccountVerifiedByChanged
        } = this.props;

        const { history, params } = this.state;

        if(!logged_in){

            history.push("/");

        }else{

            const driver_id = params.driver_id;

            getDriverData(driver_id, access_token, client, uid, history);

            const cable = this.state.cable;

            let driver_account_channel_subscription = this.state.driver_account_channel_subscription;

            if(driver_account_channel_subscription === null){

                driver_account_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'DriverAccountChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        driver_id: driver_id
                    },
                    {
                        connected: () => {

                            console.log('DriverAccountChannel Connected!');

                        },
                        received: (data) => {

                            console.log("DriverAccountChannel Received!");

                            console.log(data);

                            if(data.verified_by !== undefined){

                                const verified_by = data.verified_by;

                                console.log(verified_by);

                                driverAccountVerifiedByChanged(verified_by);


                            }

                            if(data.driver_verified !== undefined){

                                const driver_verified = data.driver_verified;

                                console.log(driver_verified);

                                driverAccountDriverVerifiedChanged(driver_verified);

                            }

                            if(data.unverified_reasons !== undefined){

                                const unverified_reasons = data.unverified_reasons;

                                console.log(unverified_reasons);

                                driverAccountUnverifiedReasonsChanged(unverified_reasons);

                            }

                            if(data.review_status !== undefined){

                                const review_status = data.review_status;

                                console.log(review_status);

                                driverAccountReviewStatusChanged(review_status);

                            }

                            if(data.admins_declined !== undefined){

                                const admins_declined = data.admins_declined;

                                console.log(admins_declined);

                                driverAccountAdminsDeclinedChanged(admins_declined);

                            }


                            if(data.current_reviewers !== undefined){

                                const current_reviewers = data.current_reviewers;

                                console.log(current_reviewers);

                                driverAccountReviewersChanged(current_reviewers);

                            }


                        }
                    }
                );

                this.setState({driver_account_channel_subscription: driver_account_channel_subscription});

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
        roles,
        id
    } = state.login;

    const {
        initializing_page,
        profile_picture,
        name,
        phone_number,
        country,
        driver_verified,
        account_blocked,
        review_status,
        registered_at,
        latitude,
        longitude,
        driver_license_pictures,
        national_id_pictures,
        vehicle_registration_pictures,
        verified_by,
        admins_declined,
        unverified_reasons,
        email,
        current_reviewers
    } = state.view_driver_account;


    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
        initializing_page,
        profile_picture,
        name,
        phone_number,
        country,
        driver_verified,
        account_blocked,
        review_status,
        registered_at,
        latitude,
        longitude,
        driver_license_pictures,
        national_id_pictures,
        vehicle_registration_pictures,
        verified_by,
        admins_declined,
        unverified_reasons,
        email,
        current_reviewers
    };

};


export default connect(mapStateToProps, {
    getDriverData,
    clearViewDriverAccountState,
    driverAccountReviewersChanged,
    driverAccountAdminsDeclinedChanged,
    driverAccountReviewStatusChanged,
    driverAccountUnverifiedReasonsChanged,
    driverAccountDriverVerifiedChanged,
    driverAccountVerifiedByChanged
})(ViewDriverAccount);
