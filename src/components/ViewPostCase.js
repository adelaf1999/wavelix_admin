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
import {  Spinner  } from "react-bootstrap";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

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


    show(){

        const  { initializing_page } = this.props;

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