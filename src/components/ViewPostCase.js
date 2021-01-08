import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from "./Wrapper";
import {
    getPostCase,
    clearViewPostCaseState,
    postCaseReviewersChanged,
    postCaseDeletedByChanged,
    postCaseReviewStatusChanged,
    postCaseAdminsReviewedChanged,
    postCaseReviewedByChanged,
    postCasePostChanged,
    postCasePostComplaintsChanged
} from "../actions";
import {  Spinner, Card, Form, Image, ListGroup, Button } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";
import _ from "lodash";

class ViewPostCase extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const params = props.match.params;

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const view_post_case_channel_subscription = null;

        this.state = {
            history,
            params,
            cable,
            view_post_case_channel_subscription
        };

    }

    componentWillUnmount(){

        const cable = this.state.cable;

        const view_post_case_channel_subscription = this.state.view_post_case_channel_subscription;

        if(view_post_case_channel_subscription !== null){

            cable.subscriptions.remove(view_post_case_channel_subscription);

        }

        this.props.clearViewPostCaseState();

    }

    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getPostCase,
            postCaseReviewersChanged,
            postCaseDeletedByChanged,
            postCaseReviewStatusChanged,
            postCaseAdminsReviewedChanged,
            postCaseReviewedByChanged,
            postCasePostChanged,
            postCasePostComplaintsChanged
        } = this.props;

        const { history, params } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("profile_manager") ){

            history.push("/home");

        }else{

            const post_case_id = params.post_case_id;

            getPostCase(post_case_id, access_token, client, uid, history);

            const cable = this.state.cable;

            let view_post_case_channel_subscription = this.state.view_post_case_channel_subscription;

            if(view_post_case_channel_subscription === null){

                view_post_case_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'ViewPostCaseChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid,
                        post_case_id: post_case_id
                    },
                    {
                        connected: () => {

                            console.log('ViewPostCaseChannel Connected!');

                        },
                        received: (data) => {

                            console.log("ViewPostCaseChannel Received!");

                            console.log(data);

                            if(data.current_reviewers !== undefined){

                                const current_reviewers = data.current_reviewers;

                                console.log(current_reviewers);

                                postCaseReviewersChanged(current_reviewers);

                            }

                            if(data.deleted_by !== undefined){

                                const deleted_by = data.deleted_by;

                                console.log(deleted_by);

                                postCaseDeletedByChanged(deleted_by);

                            }


                            if(data.review_status !== undefined){

                                const review_status = data.review_status;

                                console.log(review_status);

                                postCaseReviewStatusChanged(review_status);

                            }

                            if(data.admins_reviewed !== undefined){

                                const admins_reviewed = data.admins_reviewed;

                                console.log(admins_reviewed);

                                postCaseAdminsReviewedChanged(admins_reviewed);

                            }

                            if(data.reviewed_by !== undefined){

                                const reviewed_by = data.reviewed_by;

                                console.log(reviewed_by);

                                postCaseReviewedByChanged(reviewed_by);

                            }

                            if(data.post !== undefined){

                                const post = data.post;

                                console.log(post);

                                postCasePostChanged(post);

                            }

                            if(data.post_complaints !== undefined){

                                const post_complaints = data.post_complaints;

                                console.log(post_complaints);

                                postCasePostComplaintsChanged(post_complaints);

                            }

                        }
                    }
                );

                this.setState({view_post_case_channel_subscription: view_post_case_channel_subscription});

            }

        }

    }

    renderPost(post){

        if(post.media_type === "video"){

            return(

                <video id="post-case-video"  width="724" height="407"  controls>


                    <source src={post.video_file.url} />

                </video>

            );

        }else{

            return(

                <Image
                    src={post.image_file.url}
                    thumbnail
                    id="post-case-image"
                />

            );

        }

    }


    renderPostCaption(post){

        const caption = post.caption;


        if(caption !== null && !_.isEmpty(caption)){

            return(


                <div id="post-caption-container">

                    <Form.Group>

                        <Form.Label>Caption</Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={caption}
                            readOnly
                        />

                    </Form.Group>

                </div>



            );

        }

    }




    renderPostSection(){

        const { post } = this.props;

        if( _.size(post) > 0 ){

            return(

                <div>


                    <div id="post-container">

                        {this.renderPost(post)}

                    </div>

                    {this.renderPostCaption(post)}

                    {this.renderPostComments(post)}



                </div>

            );

        }

    }

    renderDeletedBy(){

        const {  deleted_by } = this.props;

        if(!_.isEmpty(deleted_by)){

            return(

                <Form.Group>

                    <Form.Label >
                        Deleted By
                    </Form.Label>


                    <Form.Control
                        readOnly
                        type="text"
                        value={deleted_by}
                    />

                </Form.Group>

            );

        }

    }

    renderComments(comments){

        const { history } = this.state;

        return _.map(comments, (comment, index) => {

            return(

                <ListGroup.Item key={index}>

                    <Form.Group>

                        <div className="post-case-list-header">

                            <Form.Label>
                                {comment.author_username}
                            </Form.Label>

                            <Button
                                variant="link"
                                onClick={(e) => {

                                    e.preventDefault();

                                    history.push(`/profiles/profile_id=${comment.author_profile_id}`);

                                }}
                            >
                                View Profile
                            </Button>

                        </div>



                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment.text}
                            readOnly
                        />

                    </Form.Group>


                </ListGroup.Item>

            );

        });

    }

    renderPostComments(post){

        const comments = post.comments;

        if(!_.isEmpty(comments)){

            return(

                <ListGroup className="post-case-list-group-container">

                    <Form.Label>Comments</Form.Label>

                    {this.renderComments(comments)}

                </ListGroup>

            );

        }

    }


    postComplaintAdditionalInfo(additional_info){

        if(!_.isEmpty(additional_info)){

            return(

                <Form.Control
                    as="textarea"
                    rows={3}
                    value={additional_info}
                    readOnly
                />

            );

        }

    }

    renderPostComplaints(post_complaints){

        const { history } = this.state;

        return _.map(post_complaints, (post_complaint, index) => {

            return(

                <ListGroup.Item key={index}>

                    <div className="post-case-list-header">

                        <Form.Label>
                            {post_complaint.username}
                        </Form.Label>

                        <Button
                            variant="link"
                            onClick={(e) => {

                                e.preventDefault();

                                history.push(`/profiles/profile_id=${post_complaint.profile_id}`);

                            }}
                        >
                            View Profile
                        </Button>

                    </div>

                    <p id="post-case-report-type">Report Type: {_.startCase(post_complaint.report_type)}</p>

                    {this.postComplaintAdditionalInfo(post_complaint.additional_info)}

                </ListGroup.Item>

            );

        });


    }

    renderPostComplaintsSection(){

        const { post_complaints } = this.props;

        if(!_.isEmpty(post_complaints)){

            return(

                <ListGroup className="post-case-list-group-container" >

                    <Form.Label>Reporter(s)</Form.Label>

                    {this.renderPostComplaints(post_complaints)}

                </ListGroup>

            );

        }

    }

    show(){

        const  {
            initializing_page,
            post_author_username,
            review_status,
            post_author_profile_id
        } = this.props;

        const { history  } = this.state;

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

                    <div id="view-store-account-container">

                        <Card className="view-post-case-card">

                            <Card.Header
                                as="h5"
                                className="view-post-case-card-header"
                            >
                                Case Details
                            </Card.Header>

                            <Card.Body>

                                <Form>

                                    {this.renderPostSection()}


                                    <Form.Group>

                                       <div id="post-case-author-username-container">

                                           <Form.Label >
                                               Author Username
                                           </Form.Label>

                                           <Button
                                               variant="link"
                                               onClick={(e) => {

                                                   e.preventDefault();

                                                   history.push(`/profiles/profile_id=${post_author_profile_id}`);

                                               }}
                                           >
                                               View Profile
                                           </Button>



                                       </div>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={post_author_username}
                                        />

                                    </Form.Group>


                                    <Form.Group>

                                        <Form.Label >
                                            Review Status
                                        </Form.Label>


                                        <Form.Control
                                            readOnly
                                            type="text"
                                            value={_.startCase(review_status)}
                                        />

                                    </Form.Group>

                                    {this.renderDeletedBy()}

                                    {this.renderPostComplaintsSection()}


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
        roles,
        id
    } = state.login;

    const {
        initializing_page,
        post,
        post_author_username,
        post_author_profile_id,
        review_status,
        deleted_by,
        post_complaints,
        admins_reviewed,
        reviewed_by,
        current_reviewers
    } = state.view_post_case;

    return{
        access_token,
        client,
        uid,
        logged_in,
        roles,
        id,
        initializing_page,
        post,
        post_author_username,
        post_author_profile_id,
        review_status,
        deleted_by,
        post_complaints,
        admins_reviewed,
        reviewed_by,
        current_reviewers
    };

};

export default connect(mapStateToProps, {
    getPostCase,
    clearViewPostCaseState,
    postCaseReviewersChanged,
    postCaseDeletedByChanged,
    postCaseReviewStatusChanged,
    postCaseAdminsReviewedChanged,
    postCaseReviewedByChanged,
    postCasePostChanged,
    postCasePostComplaintsChanged
})(ViewPostCase);