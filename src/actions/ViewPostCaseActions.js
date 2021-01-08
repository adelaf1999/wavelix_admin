import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_POST_CASE,
    VIEW_POST_CASE_ROUTE,
    GET_POST_CASE_COMPLETE,
    CLEAR_VIEW_POST_CASE_STATE,
    POST_CASE_REVIEWERS_CHANGED,
    POST_CASE_DELETED_BY_CHANGED,
    POST_CASE_REVIEW_STATUS_CHANGED,
    POST_CASE_ADMINS_REVIEWED_CHANGED,
    POST_CASE_REVIEWED_BY_CHANGED,
    POST_CASE_POST_CHANGED,
    POST_CASE_POST_COMPLAINTS_CHANGED,
    MARK_POST_SAFE_ROUTE,
    DELETE_UNSAFE_POST_ROUTE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const deleteUnsafePost = (post_case_id, access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        let bodyFormData = getFormData({
            post_case_id: post_case_id
        });


        axios.post(DELETE_UNSAFE_POST_ROUTE, bodyFormData, config)
            .then(response => {

                console.log(response);

            }).catch(error => {

            if(error.response !== undefined){

                const status = error.response.status;

                dispatch({type: LOGOUT_SUCCESS});

                if(status === 440){

                    dispatch({type: OPEN_TIMEOUT_MODAL});

                }

                history.push("/");

            }

        });


    };

};

export const markPostSafe = (post_case_id, access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        let bodyFormData = getFormData({
            post_case_id: post_case_id
        });


        axios.post(MARK_POST_SAFE_ROUTE, bodyFormData, config)
            .then(response => {

                console.log(response);

            }).catch(error => {

            if(error.response !== undefined){

                const status = error.response.status;

                dispatch({type: LOGOUT_SUCCESS});

                if(status === 440){

                    dispatch({type: OPEN_TIMEOUT_MODAL});

                }

                history.push("/");

            }

        });


    };

};

export const postCasePostComplaintsChanged = (post_complaints) => {

    return{
      type: POST_CASE_POST_COMPLAINTS_CHANGED,
      payload: post_complaints
    };

};

export const postCasePostChanged = (post) => {

    return{
      type: POST_CASE_POST_CHANGED,
      payload: post
    };

};

export const postCaseReviewedByChanged = (reviewed_by) => {

    return{
      type: POST_CASE_REVIEWED_BY_CHANGED,
      payload: reviewed_by
    };

};

export const postCaseAdminsReviewedChanged = (admins_reviewed) => {

    return{
      type: POST_CASE_ADMINS_REVIEWED_CHANGED,
      payload: admins_reviewed
    };

};

export const postCaseReviewStatusChanged = (review_status) => {

    return{
      type: POST_CASE_REVIEW_STATUS_CHANGED,
      payload: review_status
    };

};

export const postCaseDeletedByChanged = (deleted_by) => {

    return{
      type: POST_CASE_DELETED_BY_CHANGED,
      payload: deleted_by
    };

};

export const postCaseReviewersChanged = (current_reviewers) => {

    return{
      type: POST_CASE_REVIEWERS_CHANGED,
      payload: current_reviewers
    };

};

export const clearViewPostCaseState = () => {

    return{
      type: CLEAR_VIEW_POST_CASE_STATE
    };

};

export const getPostCase = (post_case_id, access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        let bodyFormData = getFormData({
            post_case_id: post_case_id
        });

        dispatch({type: GET_POST_CASE});

        axios.post(VIEW_POST_CASE_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const post = data.post;

                    const post_author_username = data.post_author_username;

                    const post_author_profile_id = data.post_author_profile_id;

                    const review_status = data.review_status;

                    const deleted_by = data.deleted_by;

                    const post_complaints = data.post_complaints;

                    const admins_reviewed = data.admins_reviewed;

                    const reviewed_by = data.reviewed_by;

                    console.log(post);

                    console.log(post_author_username);

                    console.log(post_author_profile_id);

                    console.log(review_status);

                    console.log(deleted_by);

                    console.log(post_complaints);

                    console.log(admins_reviewed);

                    console.log(reviewed_by);

                    dispatch({type: GET_POST_CASE_COMPLETE, payload: {
                        post: post,
                        post_author_username: post_author_username,
                        post_author_profile_id: post_author_profile_id,
                        review_status: review_status,
                        deleted_by: deleted_by,
                        post_complaints: post_complaints,
                        admins_reviewed: admins_reviewed,
                        reviewed_by: reviewed_by
                    }});

                }else{

                    history.goBack();

                }

            }).catch(error => {

            if(error.response !== undefined){

                const status = error.response.status;

                dispatch({type: LOGOUT_SUCCESS});

                if(status === 440){

                    dispatch({type: OPEN_TIMEOUT_MODAL});

                }

                history.push("/");

            }

        });

    };

};