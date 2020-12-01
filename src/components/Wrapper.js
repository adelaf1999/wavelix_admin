import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    getRoles
} from "../actions";


class Wrapper extends Component{

    constructor(props){
        super(props);
        const history = props.history;
        this.state = {
            history
        };
    }

    componentDidMount(){

        const {
            access_token,
            client,
            uid,
            getRoles
        } = this.props;

        getRoles(access_token, client, uid, this.state.history);

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
    getRoles
})(Wrapper);