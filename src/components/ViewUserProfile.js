import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getUserProfile,
    clearViewUserProfileState
} from "../actions";
import {  Spinner } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class ViewUserProfile extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const profile_moderation_channel_subscription = null;

        this.state = {
          history,
          params,
          cable,
          profile_moderation_channel_subscription
        };

    }


    componentWillUnmount(){

        const cable = this.state.cable;

        const profile_moderation_channel_subscription = this.state.profile_moderation_channel_subscription;

        if(profile_moderation_channel_subscription !== null){

            cable.subscriptions.remove(profile_moderation_channel_subscription);

        }

        this.props.clearViewUserProfileState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getUserProfile
        } = this.props;

        const { history, params } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("profile_manager") ){

            history.push("/home");

        }else{

            const profile_id = params.profile_id;

            getUserProfile(profile_id,  access_token, client, uid, history);

            const cable = this.state.cable;

            let profile_moderation_channel_subscription = this.state.profile_moderation_channel_subscription;

            if(profile_moderation_channel_subscription === null){

                profile_moderation_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'ProfileModerationChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        profile_id: profile_id
                    },
                    {
                        connected: () => {

                            console.log('ProfileModerationChannel Connected!');

                        },
                        received: (data) => {

                            console.log("ProfileModerationChannel Received!");

                            console.log(data);

                        }
                    }
                );


                this.setState({profile_moderation_channel_subscription: profile_moderation_channel_subscription});


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
        profile_picture,
        username,
        email,
        user_type,
        status,
        blocked_by,
        profile_bio,
        story_posts,
        profile_posts,
        admins_requested_block,
        blocked_reasons,
        block_requests
    } = state.view_user_profile;

    return{
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        profile_picture,
        username,
        email,
        user_type,
        status,
        blocked_by,
        profile_bio,
        story_posts,
        profile_posts,
        admins_requested_block,
        blocked_reasons,
        block_requests
    };

};

export default connect(mapStateToProps, {
    getUserProfile,
    clearViewUserProfileState
})(ViewUserProfile);
