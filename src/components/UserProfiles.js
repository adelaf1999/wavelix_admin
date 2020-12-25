import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getUserProfiles,
    clearUserProfilesState
} from "../actions";
import {  Spinner, Form, FormControl } from "react-bootstrap";

class UserProfiles extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        this.state = {
            history,
            search
        };

    }

    componentWillUnmount(){

        this.props.clearUserProfilesState();

    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            limit,
            getUserProfiles
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("profile_manager") ){

            history.push("/home");

        }else{

            getUserProfiles(limit, access_token, client, uid, history);

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

                    <Form id="user-profiles-searchbar" inline>

                        <FormControl
                            type="text"
                            placeholder="Search profile by username or email"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                            }}
                        />


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
        limit
    } = state.user_profiles;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        limit
    };

};

export default connect(mapStateToProps, {
    getUserProfiles,
    clearUserProfilesState
})(UserProfiles);
