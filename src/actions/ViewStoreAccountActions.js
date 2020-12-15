import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_STORE_ACCOUNT_ROUTE,
    GET_STORE_DATA,
    GET_STORE_DATA_COMPLETE,
    CLEAR_VIEW_STORE_ACCOUNT_STATE,
    STORE_ACCOUNT_REVIEWERS_CHANGED,
    STORE_ACCOUNT_STATUS_CHANGED,
    STORE_ACCOUNT_REVIEW_STATUS_CHANGED,
    STORE_ACCOUNT_VERIFIED_BY_CHANGED
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const storeAccountVerifiedByChanged = (verified_by) => {

    return{
      type: STORE_ACCOUNT_VERIFIED_BY_CHANGED,
      payload: verified_by
    };

};

export const storeAccountReviewStatusChanged = (review_status) => {

    return{
      type: STORE_ACCOUNT_REVIEW_STATUS_CHANGED,
      payload: review_status
    };

};

export const storeAccountStatusChanged = (status) => {

    return{
      type: STORE_ACCOUNT_STATUS_CHANGED,
      payload: status
    };

};

export const storeAccountReviewersChanged = (current_reviewers) => {

    return{
      type: STORE_ACCOUNT_REVIEWERS_CHANGED,
      payload: current_reviewers
    };

};

export const clearViewStoreAccountState = () => {

    return{
      type: CLEAR_VIEW_STORE_ACCOUNT_STATE
    };

};

export const getStoreData = (store_user_id, access_token, client, uid, history) => {

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
            store_user_id: store_user_id
        });

        dispatch({type: GET_STORE_DATA});

        axios.post(VIEW_STORE_ACCOUNT_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const store_owner = data.store_owner;

                    const store_username = data.store_username;

                    const store_name = data.store_name;

                    const status = data.status;

                    const review_status = data.review_status;

                    const country = data.country;

                    const has_sensitive_products = data.has_sensitive_products;

                    const business_license = data.business_license;

                    const registered_at = data.registered_at;

                    const location = data.location;

                    const store_owner_number = data.store_owner_number;

                    const store_number = data.store_number;

                    const verified_by = data.verified_by;

                    const store_email = data.store_email;

                    const admins_declined = data.admins_declined;

                    dispatch({type: GET_STORE_DATA_COMPLETE, payload: {
                        store_owner: store_owner,
                        store_username: store_username,
                        store_name: store_name,
                        status: status,
                        review_status: review_status,
                        country: country,
                        has_sensitive_products: has_sensitive_products,
                        business_license: business_license,
                        registered_at: registered_at,
                        location: location,
                        store_owner_number: store_owner_number,
                        store_number: store_number,
                        verified_by: verified_by,
                        store_email: store_email,
                        admins_declined: admins_declined
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