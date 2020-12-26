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
    blockRequestsChanged,
    blockCustomerProfile,
    requestStoreProfileBlock,
    toggleStoreProfileStatus
} from "../actions";
import {  Spinner, Image, Card, Form, Carousel, Alert, Button, Modal } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";


class ViewUserProfile extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const profile_moderation_channel_subscription = null;

        const block_customer_profile_modal_visible = false;

        const request_profile_block_modal_visible = false;

        const toggle_store_profile_modal_visible = false;

        const reason = "";

        this.state = {
            history,
            params,
            cable,
            profile_moderation_channel_subscription,
            block_customer_profile_modal_visible,
            reason,
            request_profile_block_modal_visible,
            toggle_store_profile_modal_visible
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


    blockCustomerProfileButton(){

        const { status } = this.props;

        if(status !== "blocked"){

            return(

                <Button
                    variant="outline-danger"
                    onClick={(e) => {

                        e.preventDefault();

                        this.setState({block_customer_profile_modal_visible: true});

                    }}
                    className="block-profile-button"
                >
                    Permanently Block Profile
                </Button>

            );

        }

    }

    renderBlockRequests(){

        const { block_requests } = this.props;

        if(block_requests.length > 0){

            return(

                <div>


                    <Form.Label className="store-verification-label">
                        Block Requests
                    </Form.Label>


                    {
                        _.map(block_requests, (block_request, index) => {

                            return(

                                <Card
                                    key={index}
                                    className="profile-blocked-reason-card"
                                >

                                    <Card.Header>{_.startCase(block_request.admin_name)}</Card.Header>

                                    <Card.Body>

                                        <Card.Text>
                                            {block_request.reason}
                                        </Card.Text>


                                    </Card.Body>

                                </Card>

                            );

                        })
                    }


                </div>

            );


        }

    }

    renderBlockedReasons(){

        const { blocked_reasons } = this.props;

        if(blocked_reasons.length > 0){

            return(

                <div>


                    <Form.Label className="store-verification-label">
                        Blocked Reasons
                    </Form.Label>


                    {
                        _.map(blocked_reasons, (blocked_reason, index) => {

                            return(

                                <Card
                                    key={index}
                                    className="profile-blocked-reason-card"
                                >

                                    <Card.Header>{_.startCase(blocked_reason.admin_name)}</Card.Header>

                                    <Card.Body>

                                        <Card.Text>
                                            {blocked_reason.reason}
                                        </Card.Text>


                                    </Card.Body>

                                </Card>

                            );

                        })
                    }


                </div>

            );

        }

    }

    storeProfileBlockingGuidelines(){

        const { roles } = this.props;

        if(roles.includes("profile_manager")){

            return(

                <Alert
                    variant="warning"
                    className="profile-blocking-instructions"
                >
                    If you have found that a profile has one or more posts
                    which contain sexual content, violent or repulsive content,
                    hateful or abusive content, harmful or dangerous acts, child
                    abuse, promoting terrorism, spam or misleading content, or
                    infringing somebody else's copyrighted material you can request
                    the administrators to check the profile by clicking the request
                    profile block button below so that they decide on the right course
                    of action.
                </Alert>

            );

        }else{


            return(


                <Alert
                    variant="warning"
                    className="profile-blocking-instructions"
                >
                    If you have found that a profile has one or more posts
                    which contain sexual content, violent or repulsive content,
                    hateful or abusive content, harmful or dangerous acts, child
                    abuse, promoting terrorism, spam or misleading content, or
                    infringing somebody else's copyrighted material please warn
                    the store owner by email or phone number about it so that they
                    delete the posts that contain harmful content. If the store owner
                    was unresponsive or there are lots of harmful content posted
                    you can immediacy block the store's profile, and all the store's
                    profile and story posts will be deleted and they wont be able
                    to create posts again. You may also choose to unblock them later on.
                </Alert>


            );


        }

    }

    requestProfileBlockButton(){

        const { roles , status, admins_requested_block, id} = this.props;

        if(roles.includes("profile_manager") && status !== "blocked" && !admins_requested_block.includes(id) ){

            return(

                <Button
                    variant="outline-primary"
                    onClick={(e) => {

                        e.preventDefault();

                        this.setState({request_profile_block_modal_visible: true});

                    }}
                    className="block-profile-button"
                >
                    Request Profile Block
                </Button>


            );

        }

    }

    toggleStoreProfileStatusButton(){

        const { roles, status } = this.props;

        if(roles.includes("root_admin")){

            if(status === "unblocked"){

                return(

                    <Button
                        variant="outline-danger"
                        onClick={(e) => {

                            e.preventDefault();

                            this.setState({toggle_store_profile_modal_visible: true});

                        }}
                        className="block-profile-button"
                    >
                       Block Profile
                    </Button>

                );

            }else{

                return(

                    <Button
                        variant="outline-primary"
                        onClick={(e) => {

                            e.preventDefault();

                            this.setState({toggle_store_profile_modal_visible: true});

                        }}
                        className="block-profile-button"
                    >
                        Unblock Profile
                    </Button>

                );

            }

        }

    }

    blockProfileCard(){

        const { user_type } = this.props;

        if(user_type === "customer_user"){

            return(

                <Card className="view-user-profile-card">

                    <Card.Header
                        as="h5"
                        className="view-profile-card-header"
                    >
                        Profile Blocking Guidelines
                    </Card.Header>

                    <Card.Body className="user-profile-card-body">

                        <Form>

                            <div>

                                <Form.Label className="profile-block-guidelines-label">
                                    Guidelines
                                </Form.Label>

                                <Alert
                                    variant="warning"
                                    className="profile-blocking-instructions"
                                >
                                    If you have found that a profile has one or more posts
                                    which contain sexual content, violent or repulsive content,
                                    hateful or abusive content, harmful or dangerous acts, child
                                    abuse, promoting terrorism, spam or misleading content, or
                                    infringing somebody else's copyrighted material you may choose
                                    to contact the user and warn them once and only once to delete the posts,
                                    or you may immediately block the profile permanently so that all
                                    the profile and story posts of the user get deleted, that way they
                                    wont be able to post harmful content ever again.
                                </Alert>

                                {this.blockCustomerProfileButton()}


                                {this.renderBlockedReasons()}

                            </div>

                        </Form>

                    </Card.Body>



                </Card>

            );

        }else{

            return(


                <Card className="view-user-profile-card">


                    <Card.Header
                        as="h5"
                        className="view-profile-card-header"
                    >
                        Profile Blocking Guidelines
                    </Card.Header>


                    <Card.Body className="user-profile-card-body">

                        <Form>

                            <div>

                                <Form.Label className="profile-block-guidelines-label">
                                    Guidelines
                                </Form.Label>

                                {this.storeProfileBlockingGuidelines()}

                                {this.requestProfileBlockButton()}

                                {this.renderBlockRequests()}

                                {this.toggleStoreProfileStatusButton()}


                            </div>

                        </Form>


                    </Card.Body>



                </Card>



            );

        }

    }

    exitBlockCustomerProfileModal(){

        this.setState({block_customer_profile_modal_visible: false, reason: ''});

    }

    blockCustomerProfileModalButton(){

        const { reason, params, history } = this.state;

        const profile_id = params.profile_id;

        if(_.isEmpty(reason)){

            return(

                <Button
                    disabled
                    variant="danger"
                >
                    Permanently Block
                </Button>

            );

        }else{

            return(

                <Button
                    variant="danger"
                    onClick={(e) => {

                        e.preventDefault();

                        const {
                            access_token,
                            client,
                            uid,
                            blockCustomerProfile
                        } = this.props;


                        blockCustomerProfile(profile_id, reason, access_token, client, uid, history);

                        this.exitBlockCustomerProfileModal();

                    }}
                >
                    Permanently Block
                </Button>
            );

        }


    }

    blockCustomerProfileModal(){

        const { block_customer_profile_modal_visible } = this.state;

        if(block_customer_profile_modal_visible){

            return(

                <Modal
                    show={block_customer_profile_modal_visible}
                    onHide={() => {
                        this.exitBlockCustomerProfileModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Permanently Block Profile</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group controlId="formPlaintextCredential">

                            <Form.Label>
                                The user's profile will be permanently blocked,
                                their profile and story posts will be deleted and
                                the user will not be able to create any more posts.
                                Please enter the reason(s) for permanently blocking
                                the user's profile:
                            </Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) => {
                                    this.setState({reason: e.target.value});
                                }}
                            />

                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitBlockCustomerProfileModal();

                            }}
                        >
                            Close
                        </Button>

                        {this.blockCustomerProfileModalButton()}



                    </Modal.Footer>


                </Modal>

            );

        }

    }


    exitRequestProfileBlockModal(){

        this.setState({request_profile_block_modal_visible: false, reason: ''});

    }

    requestProfileBlockModalButton(){

        const { reason, params, history } = this.state;

        const profile_id = params.profile_id;

        if(_.isEmpty(reason)){

            return(

                <Button
                    disabled
                    variant="primary"
                >
                    Request Block
                </Button>


            );

        }else{

            return(

                <Button
                    variant="primary"
                    onClick={(e) => {

                        e.preventDefault();

                        const {
                            access_token,
                            client,
                            uid,
                            requestStoreProfileBlock
                        } = this.props;

                        requestStoreProfileBlock(profile_id, reason, access_token, client, uid, history);


                        this.exitRequestProfileBlockModal();

                    }}
                >
                    Request Block
                </Button>

            );

        }


    }

    requestProfileBlockModal(){

        const { request_profile_block_modal_visible } = this.state;

        if(request_profile_block_modal_visible){

            return(

                <Modal
                    show={request_profile_block_modal_visible}
                    onHide={() => {
                        this.exitRequestProfileBlockModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>Request Profile Block</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group controlId="formPlaintextCredential">

                            <Form.Label>
                                Please enter the reason(s) for requesting the store
                                profile to be blocked:
                            </Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) => {
                                    this.setState({reason: e.target.value});
                                }}
                            />

                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitRequestProfileBlockModal();

                            }}
                        >
                            Close
                        </Button>


                        {this.requestProfileBlockModalButton()}



                    </Modal.Footer>


                </Modal>

            );

        }

    }

    exitToggleStoreProfileModal(){

        this.setState({toggle_store_profile_modal_visible: false});

    }


    toggleStoreProfileModalBody(){

        const { status } = this.props;

        if(status === "unblocked"){

            return(

                <p>
                    The store's profile will be blocked and they wont be able to post
                    any new post and their current profile and story posts will be deleted.
                </p>

            );

        }else{

            return(

                <p>
                    The store's profile will be unblocked and they will be able to start posting
                    profile and story posts again.
                </p>


            );

        }

    }

    toggleStoreProfileModal(){

        const { toggle_store_profile_modal_visible, params, history  } = this.state;

        const {
            status,
            access_token,
            client,
            uid,
            toggleStoreProfileStatus
        } = this.props;


        const profile_id = params.profile_id;

        if(toggle_store_profile_modal_visible){

            return(

                <Modal
                    show={toggle_store_profile_modal_visible}
                    onHide={() => {
                        this.exitToggleStoreProfileModal();
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title>{status === "unblocked" ? "Block" : "Unblock"} Store Profile</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        {this.toggleStoreProfileModalBody()}

                    </Modal.Body>

                    <Modal.Footer>


                        <Button
                            variant="secondary"
                            onClick={(e) => {

                                e.preventDefault();

                                this.exitToggleStoreProfileModal();

                            }}
                        >
                            Close
                        </Button>


                        <Button
                            variant={status === "unblocked" ? "danger" : "primary"}
                            onClick={(e) => {

                                e.preventDefault();

                                toggleStoreProfileStatus(profile_id, access_token, client, uid, history);

                                this.exitToggleStoreProfileModal();


                            }}
                        >
                            {status === "unblocked" ? "Block" : "Unblock"} Profile
                        </Button>


                    </Modal.Footer>


                </Modal>



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
            status,
            customer_user_id,
            store_user_id
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

                    <div className="header-container">

                        <Image
                            className="profile-photo"
                            src={_.isEmpty(profile_picture) ? "https://via.placeholder.com/150x180" : profile_picture}
                            thumbnail
                        />

                    </div>

                    <div id="user-profile-cards-container">


                        <Card className="view-user-profile-card">

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


                                    <Button
                                        variant="outline-primary"
                                        onClick={(e) => {

                                            e.preventDefault();

                                            if(user_type === "customer_user"){

                                                history.push(`/customer-accounts/customer_user_id=${customer_user_id}`);

                                            }else{

                                                history.push(`/store-accounts/store_user_id=${store_user_id}`);

                                            }

                                        }}
                                        id="view-user-profile-button"
                                    >
                                        {`View ${user_type === "customer_user" ? "Customer" : "Store"} Information`}
                                    </Button>


                                </Form>

                            </Card.Body>

                        </Card>

                        {this.blockProfileCard()}


                    </div>

                    {this.blockCustomerProfileModal()}

                    {this.requestProfileBlockModal()}

                    {this.toggleStoreProfileModal()}

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
        block_requests,
        customer_user_id,
        store_user_id
    } = state.view_user_profile;

    return{
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
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
        block_requests,
        customer_user_id,
        store_user_id
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
    blockRequestsChanged,
    blockCustomerProfile,
    requestStoreProfileBlock,
    toggleStoreProfileStatus
})(ViewUserProfile);
