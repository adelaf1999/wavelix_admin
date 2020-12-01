import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutAdmin } from "../actions";
import { Button } from "react-bootstrap";

class Home extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = {
          history
        };

    }

    componentDidMount(){

        const { logged_in } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }

    }


    render(){

        return(

            <div>

                <Button
                    variant="danger"

                    onClick={(e) => {

                        e.preventDefault();

                        const { logoutAdmin, access_token, client, uid } = this.props;

                        logoutAdmin(access_token, client, uid, this.state.history);

                    }}
                >
                    LOGOUT
                </Button>


            </div>

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
    logoutAdmin
})(Home)