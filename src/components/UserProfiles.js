import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getUserProfiles,
    clearUserProfilesState,
    searchUserProfiles,
    searchUserProfilesLimitChanged
} from "../actions";
import {  Spinner, Form, FormControl, Table, Image, Button} from "react-bootstrap";
import _ from "lodash";

class UserProfiles extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            history,
            search
        };

    }

    handleScroll() {

        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

        const body = document.body;

        const html = document.documentElement;

        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);

        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight) {

            console.log("bottom reached");

            const {
                searchUserProfiles,
                limit,
                access_token,
                client,
                uid,
                searchUserProfilesLimitChanged
            } = this.props;

            const { search, history } = this.state;

            const new_limit = limit + 50;

            searchUserProfilesLimitChanged(new_limit);

            searchUserProfiles(new_limit, search, access_token, client, uid, history);

        }
    }



    componentWillUnmount(){

        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearUserProfilesState();

    }


    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

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

    renderProfiles(){

        const { profiles } = this.props;

        return _.map(profiles, (profile, index) => {

            return(

                <tr key={index}>

                    <td>

                        <Image
                            src={profile.profile_picture === null ? 'https://via.placeholder.com/150x180' : profile.profile_picture}
                            thumbnail
                            className="profile-photo"
                        />

                    </td>


                    <td>

                        {profile.username}

                    </td>


                    <td>

                        {profile.email}

                    </td>


                    <td>

                        {profile.user_type === "customer_user" ? 'Personal' : 'Business'}

                    </td>

                    <td>

                        {_.startCase(profile.status)}

                    </td>


                    <td>

                        <Button
                            variant="link"
                            onClick={() => {
                                console.log("view profile");
                            }}
                        >
                            View
                        </Button>

                    </td>


                </tr>

            );

        });

    }

    renderUserProfiles(){

        const { profiles } = this.props;

        if(profiles.length === 0){

            return(

                <div className="center-container">

                    <p className="no-accounts-notice">No Accounts Found</p>

                </div>

            );

        }else{

            return(

                <Table striped bordered hover>

                    <thead>

                    <tr>
                        <th>Profile Picture</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Account Type</th>
                        <th>Profile Status</th>
                        <th></th>
                    </tr>

                    </thead>



                    <tbody>

                        {this.renderProfiles()}

                    </tbody>


                </Table>

            );

        }

    }


    show(){

        const {
            initializing_page,
            searchUserProfiles,
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

                    <Form id="user-profiles-searchbar" inline>

                        <FormControl
                            type="text"
                            placeholder="Search profile by username or email"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                searchUserProfiles(limit, new_search, access_token, client, uid, history);

                            }}
                        />

                    </Form>


                    {this.renderUserProfiles()}



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
        profiles
    } = state.user_profiles;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        limit,
        profiles
    };

};

export default connect(mapStateToProps, {
    getUserProfiles,
    clearUserProfilesState,
    searchUserProfiles,
    searchUserProfilesLimitChanged
})(UserProfiles);
