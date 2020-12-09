import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    getRoles,
    rolesChanged
} from "../actions";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";




class Wrapper extends Component{

    constructor(props){

        super(props);

        const history = props.history;

       const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

       const admin_channel_subscription = null;

        this.state = {
            history,
            cable,
            admin_channel_subscription
        };
    }

    componentDidMount(){

        const {
            access_token,
            client,
            uid,
            getRoles,
            rolesChanged
        } = this.props;

        getRoles(access_token, client, uid, this.state.history);


        const cable = this.state.cable;

        let admin_channel_subscription = this.state.admin_channel_subscription;

        if(admin_channel_subscription === null){

            admin_channel_subscription = cable.subscriptions.create(
                {
                    channel: 'AdminChannel',
                    access_token: access_token,
                    client: client,
                    uid: uid
                },
                {
                    connected: () => {

                        console.log('AdminChannel Connected!');

                    },
                    received: (data) => {

                        console.log("AdminChannel Received!");

                        console.log(data);

                        if(data.roles !== undefined){

                            const new_roles = data.roles;

                            rolesChanged(new_roles);

                        }

                    }
                }
            );

            this.setState({admin_channel_subscription: admin_channel_subscription});

        }


    }


    componentWillUnmount(){

        const cable = this.state.cable;

        const admin_channel_subscription = this.state.admin_channel_subscription;

        if(admin_channel_subscription !== null){

            cable.subscriptions.remove(admin_channel_subscription);

        }

    }

    render(){

        return(
            <Fragment>

                {this.props.children}

            </Fragment>
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


    return {
        access_token,
        client,
        uid,
        logged_in
    };


};


export default connect(mapStateToProps, {
    getRoles,
    rolesChanged
})(Wrapper);