import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getUserProfile,
    clearViewUserProfileState,
    profileStatusChanged,
    profileBlockedByChanged,
    profileBlockedReasonsChanged,
    storyPostsChanged,
    profilePostsChanged,
    adminsRequestedBlockChanged,
    blockRequestsChanged
} from "../actions";
import {  Spinner, Image, Card, Form, Carousel } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";
import {profileStatusChanged} from "../actions/ViewUserProfileActions";

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
            getUserProfile,
            profileStatusChanged,
            profileBlockedByChanged,
            profileBlockedReasonsChanged,
            storyPostsChanged,
            profilePostsChanged,
            adminsRequestedBlockChanged,
            blockRequestsChanged
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

                            if(data.block_requests !== undefined){

                                const block_requests = data.block_requests;

                                blockRequestsChanged(block_requests);

                            }


                            if(data.admins_requested_block !== undefined){

                                const admins_requested_block = data.admins_requested_block;

                                adminsRequestedBlockChanged(admins_requested_block);

                            }

                            if(data.profile_posts !== undefined){

                                const profile_posts = data.profile_posts;

                                profilePostsChanged(profile_posts);

                            }

                            if(data.story_posts !== undefined){

                                const story_posts = data.story_posts;

                                storyPostsChanged(story_posts);

                            }

                            if(data.blocked_reasons !== undefined){

                                const blocked_reasons = data.blocked_reasons;

                                profileBlockedReasonsChanged(blocked_reasons);

                            }

                            if(data.blocked_by !== undefined){

                                const blocked_by = data.blocked_by;

                                profileBlockedByChanged(blocked_by);

                            }

                            if(data.status !== undefined){

                                const status = data.status;

                                profileStatusChanged(status);

                            }

                        }
                    }
                );


                this.setState({profile_moderation_channel_subscription: profile_moderation_channel_subscription});


            }


        }

    }


    renderBlockedBy(){

        const { blocked_by } = this.props;

        if(!_.isEmpty(blocked_by)){

            return(

                <Form.Group>

                    <Form.Label >
                        Blocked By
                    </Form.Label>


                    <Form.Control
                        readOnly
                        type="text"
                        value={blocked_by}
                    />

                </Form.Group>

            );

        }

    }

    renderProfileBio(){

        const { profile_bio } = this.props;

        if(!_.isEmpty(profile_bio)){

            return(

                <Form.Group>

                    <Form.Label >
                        Profile Bio
                    </Form.Label>


                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={profile_bio}
                        readOnly
                    />

                </Form.Group>


            );

        }

    }

    renderPosts(posts){

        return _.map(posts, (post, index) => {

            console.log(post);


            if(post.media_type === "image"){

                return(

                    <Carousel.Item key={index}>


                        <Image
                            src={post.image_file.url}
                            thumbnail
                            className="image-post"
                        />

                    </Carousel.Item>


                );


            }else{

                return(

                    <Carousel.Item key={index}>


                        <video className="video-post"  width="600" height="600"  controls>


                            <source src={post.video_file.url} />

                        </video>

                    </Carousel.Item>

                );

            }



        });

    }

    renderStoryPosts(){

        const { story_posts } = this.props;

        if(story_posts.length > 0){

            return(


                <Form.Group>

                    <Form.Label >
                        Story Posts
                    </Form.Label>


                    <Card className="user-posts-container">

                        <Card.Body>

                            <Carousel interval={null} >

                                {this.renderPosts(story_posts)}

                            </Carousel>

                        </Card.Body>



                    </Card>

                </Form.Group>


            );

        }


    }

    renderProfilePosts(){

        const { profile_posts } = this.props;

        if(profile_posts.length > 0){

            return(


                <Form.Group>

                    <Form.Label >
                        Profile Posts
                    </Form.Label>


                    <Card className="user-posts-container">

                        <Card.Body>

                            <Carousel interval={null} >

                                {this.renderPosts(profile_posts)}

                            </Carousel>

                        </Card.Body>



                    </Card>


                </Form.Group>


            );


        }

    }

    show(){

        const {
            initializing_page,
            profile_picture,
            username,
            email,
            user_type,
            status
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

                    <div className="header-container">

                        <Image
                            className="profile-photo"
                            src={_.isEmpty(profile_picture) ? "https://via.placeholder.com/150x180" : profile_picture}
                            thumbnail
                        />

                    </div>

                    <div className="account-container">


                        <Card id="view-user-profile-card">

                            <Card.Body>

                                <Form>

                                    <Form.Group>

                                        <Form.Label >
                                            Username
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={username}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Email
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={email}
                                        />

                                    </Form.Group>

                                    <Form.Group>

                                        <Form.Label >
                                            Account Type
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={user_type === "customer_user" ? 'Personal' : 'Business'}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Status
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(status)}
                                        />

                                    </Form.Group>

                                    {this.renderBlockedBy()}

                                    {this.renderProfileBio()}

                                    {this.renderStoryPosts()}

                                    {this.renderProfilePosts()}

                                </Form>

                            </Card.Body>

                        </Card>

                    </div>

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
    clearViewUserProfileState,
    profileStatusChanged,
    profileBlockedByChanged,
    profileBlockedReasonsChanged,
    storyPostsChanged,
    profilePostsChanged,
    adminsRequestedBlockChanged,
    blockRequestsChanged
})(ViewUserProfile);
