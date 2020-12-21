import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getDriverData,
    clearViewDriverAccountState
} from "../actions";
import {  Spinner } from "react-bootstrap";

class ViewDriverAccount extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        this.state = {
            history,
            params
        };

    }

    componentWillUnmount(){

        this.props.clearViewDriverAccountState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            getDriverData
        } = this.props;

        const { history, params  } = this.state;

        if(!logged_in){

            history.push("/");

        }else{

            const driver_id = params.driver_id;

            getDriverData(driver_id, access_token, client, uid, history);

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
    clearViewDriverAccountState
})(ViewDriverAccount);
