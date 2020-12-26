import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_USER_PROFILE_ROUTE,
    GET_USER_PROFILE,
    GET_USER_PROFILE_COMPLETE,
    CLEAR_VIEW_USER_PROFILE_STATE,
    PROFILE_STATUS_CHANGED,
    PROFILE_BLOCKED_BY_CHANGED,
    PROFILE_BLOCKED_REASONS_CHANGED,
    STORY_POSTS_CHANGED,
    PROFILE_POSTS_CHANGED,
    ADMINS_REQUESTED_BLOCK_CHANGED,
    BLOCK_REQUESTS_CHANGED,
    BLOCK_CUSTOMER_PROFILE_ROUTE,
    REQUEST_STORE_PROFILE_BLOCK_ROUTE,
    TOGGLE_STORE_PROFILE_STATUS_ROUTE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const toggleStoreProfileStatus = ( profile_id, access_token, client, uid, history  ) => {

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
            profile_id: profile_id
        });

        axios.post(TOGGLE_STORE_PROFILE_STATUS_ROUTE, bodyFormData, config)
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


export const requestStoreProfileBlock = ( profile_id, reason, access_token, client, uid, history ) => {

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
            profile_id: profile_id,
            reason: reason
        });

        axios.post(REQUEST_STORE_PROFILE_BLOCK_ROUTE, bodyFormData, config)
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


export const blockCustomerProfile = ( profile_id, reason, access_token, client, uid, history) => {

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
            profile_id: profile_id,
            reason: reason
        });

        axios.post(BLOCK_CUSTOMER_PROFILE_ROUTE, bodyFormData, config)
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

export const blockRequestsChanged = (block_requests) => {

    return{
      type: BLOCK_REQUESTS_CHANGED,
      payload: block_requests
    };

};

export const adminsRequestedBlockChanged = (admins_requested_block_changed) => {

    return{
      type: ADMINS_REQUESTED_BLOCK_CHANGED,
      payload: admins_requested_block_changed
    };

};

export const profilePostsChanged = (profile_posts) => {

    return{
      type: PROFILE_POSTS_CHANGED,
      payload: profile_posts
    };

};

export const storyPostsChanged = (story_posts) => {

    return{
      type: STORY_POSTS_CHANGED,
      payload: story_posts
    };

};

export const profileBlockedReasonsChanged = (blocked_reasons) => {

    return{
        type: PROFILE_BLOCKED_REASONS_CHANGED,
        payload: blocked_reasons
    };

};

export const profileBlockedByChanged = (blocked_by) => {

    return{
      type: PROFILE_BLOCKED_BY_CHANGED,
      payload: blocked_by
    };

};

export const profileStatusChanged = (status) => {

    return{
      type: PROFILE_STATUS_CHANGED,
      payload: status
    };

};


export const clearViewUserProfileState = () => {

    return{
      type: CLEAR_VIEW_USER_PROFILE_STATE
    };

};

export const getUserProfile = (profile_id,  access_token, client, uid, history) => {

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
            profile_id: profile_id
        });

        dispatch({type: GET_USER_PROFILE});

        axios.post(VIEW_USER_PROFILE_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const profile_picture = data.profile_picture;

                    const username = data.username;

                    const email = data.email;

                    const user_type = data.user_type;

                    const status = data.status;

                    const blocked_by = data.blocked_by;

                    const profile_bio = data.profile_bio;

                    const story_posts = data.story_posts;

                    const profile_posts = data.profile_posts;

                    const admins_requested_block = data.admins_requested_block;

                    const blocked_reasons = data.blocked_reasons;

                    const block_requests = data.block_requests;

                    const customer_user_id = data.customer_user_id;

                    const store_user_id = data.store_user_id;

                    dispatch({type: GET_USER_PROFILE_COMPLETE, payload: {
                        profile_picture: profile_picture,
                        username: username,
                        email: email,
                        user_type: user_type,
                        status: status,
                        blocked_by: blocked_by,
                        profile_bio: profile_bio,
                        story_posts: story_posts,
                        profile_posts: profile_posts,
                        admins_requested_block: admins_requested_block,
                        blocked_reasons: blocked_reasons,
                        block_requests: block_requests,
                        customer_user_id: customer_user_id,
                        store_user_id: store_user_id
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
