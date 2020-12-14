import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_STORE_ACCOUNT_ROUTE,
    GET_STORE_DATA,
    GET_STORE_DATA_COMPLETE,
    CLEAR_VIEW_STORE_ACCOUNT_STATE,
    STORE_ACCOUNT_REVIEWERS_CHANGED
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

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

                    const declined_verification = data.declined_verification;

                    console.log(store_owner);

                    console.log(store_username);

                    console.log(status);

                    console.log(review_status);

                    console.log(country);

                    console.log(has_sensitive_products);

                    console.log(business_license);

                    console.log(registered_at);

                    console.log(location);

                    console.log(store_owner_number);

                    console.log(store_number);

                    console.log(verified_by);

                    console.log(declined_verification);

                    dispatch({type: GET_STORE_DATA_COMPLETE, payload: {
                        store_owner: store_owner,
                        store_username: store_username,
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
                        declined_verification: declined_verification
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