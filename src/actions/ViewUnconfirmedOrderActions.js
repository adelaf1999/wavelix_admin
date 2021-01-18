import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_UNCONFIRMED_ORDER_ROUTE,
    GET_UNCONFIRMED_ORDER,
    GET_UNCONFIRMED_ORDER_COMPLETE,
    CLEAR_VIEW_UNCONFIRMED_ORDER_STATE,
    UNCONFIRMED_ORDER_REVIEWERS_CHANGED,
    UNCONFIRMED_ORDER_RECEIPT_URL_CHANGED,
    CONFIRM_UNCONFIRMED_ORDER_ROUTE,
    OPEN_UNCONFIRMED_ORDER_LOADING_MODAL,
    CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL,
    CANCEL_UNCONFIRMED_ORDER_ROUTE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";


export const closeUnconfirmedOrderLoadingModal = () => {

    return{
      type: CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL
    };

};

export const cancelUnconfirmedOrder = (access_token, client, uid, history, order_id) => {

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
            order_id: order_id
        });

        dispatch({type: OPEN_UNCONFIRMED_ORDER_LOADING_MODAL});

        axios.post(CANCEL_UNCONFIRMED_ORDER_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    dispatch({type: CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL});

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


export const confirmUnconfirmedOrder = (access_token, client, uid, history, order_id) => {

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
            order_id: order_id
        });

        dispatch({type: OPEN_UNCONFIRMED_ORDER_LOADING_MODAL});

        axios.post(CONFIRM_UNCONFIRMED_ORDER_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    dispatch({type: CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL});

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

export const unconfirmedOrderReceiptUrlChanged = (receipt_url) => {

    return{
      type: UNCONFIRMED_ORDER_RECEIPT_URL_CHANGED,
      payload: receipt_url
    };

};

export const unconfirmedOrderReviewersChanged = (current_reviewers) => {

    return{
        type: UNCONFIRMED_ORDER_REVIEWERS_CHANGED,
        payload: current_reviewers
    };

};

export const clearViewUnconfirmedOrderState = () => {

    return{
      type: CLEAR_VIEW_UNCONFIRMED_ORDER_STATE
    };

};


export const getUnconfirmedOrder = (access_token, client, uid, history, order_id) => {

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
            order_id: order_id
        });

        dispatch({type: GET_UNCONFIRMED_ORDER});

        axios.post(VIEW_UNCONFIRMED_ORDER_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const store_name = data.store_name;

                    const store_user_id = data.store_user_id;

                    const store_owner = data.store_owner;

                    const store_owner_number = data.store_owner_number;

                    const store_number = data.store_number;

                    const store_has_sensitive_products = data.store_has_sensitive_products;

                    const customer_name = data.customer_name;

                    const customer_user_id = data.customer_user_id;

                    const customer_number = data.customer_number;

                    const country = data.country;

                    const delivery_time_limit = data.delivery_time_limit;

                    const ordered_at = data.ordered_at;

                    const total_price = data.total_price;

                    const total_price_currency = data.total_price_currency;

                    const receipt_url = data.receipt_url;

                    const products = data.products;

                    const delivery_location = data.delivery_location;

                    dispatch({type: GET_UNCONFIRMED_ORDER_COMPLETE, payload: {
                        store_name: store_name,
                        store_user_id: store_user_id,
                        store_owner: store_owner,
                        store_owner_number: store_owner_number,
                        store_number: store_number,
                        store_has_sensitive_products: store_has_sensitive_products,
                        customer_name: customer_name,
                        customer_user_id: customer_user_id,
                        customer_number: customer_number,
                        country: country,
                        delivery_time_limit: delivery_time_limit,
                        ordered_at: ordered_at,
                        total_price: total_price,
                        total_price_currency: total_price_currency,
                        receipt_url: receipt_url,
                        products: products,
                        delivery_location: delivery_location
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