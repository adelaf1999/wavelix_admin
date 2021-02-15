import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_ORDER_ROUTE,
    INITIALIZE_VIEW_ORDER_PAGE,
    INITIALIZE_VIEW_ORDER_PAGE_COMPLETE,
    CLEAR_VIEW_ORDER_STATE
} from "./types";

import _ from "lodash";
import axios from "axios";
import { getFormData } from "../helpers";

export const clearViewOrderState = () => {

    return{
      type: CLEAR_VIEW_ORDER_STATE
    };

};

export const initializeViewOrderPage = (access_token, client, uid, history, order_id) => {

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

        dispatch({type: INITIALIZE_VIEW_ORDER_PAGE});

        axios.post(VIEW_ORDER_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const products = data.products;

                    const driver_id = data.driver_id;

                    const driver_name = data.driver_name;

                    const status = data.status;

                    const delivery_location = data.delivery_location;

                    const ordered_at = data.ordered_at;

                    const store_user_id = data.store_user_id;

                    const store_name = data.store_name;

                    const customer_user_id = data.customer_user_id;

                    const customer_name = data.customer_name;

                    const country = data.country;

                    const delivery_fee = data.delivery_fee;

                    const delivery_fee_currency = data.delivery_fee_currency;

                    const order_type = data.order_type;

                    const store_confirmation_status = data.store_confirmation_status;

                    const store_handles_delivery = data.store_handles_delivery;

                    const customer_canceled_order = data.customer_canceled_order;

                    const order_canceled_reason = data.order_canceled_reason;

                    const store_fulfilled_order = data.store_fulfilled_order;

                    const driver_fulfilled_order = data.driver_fulfilled_order;

                    const total_price = data.total_price;

                    const total_price_currency = data.total_price_currency;

                    const delivery_time_limit = data.delivery_time_limit;

                    const store_arrival_time_limit = data.store_arrival_time_limit;

                    const receipt_url = data.receipt_url;

                    const confirmed_by = data.confirmed_by;

                    const canceled_by = data.canceled_by;

                    const resolve_time_limit = data.resolve_time_limit;

                    const store_payments = data.store_payments;

                    const driver_payments = data.driver_payments;


                    dispatch({type: INITIALIZE_VIEW_ORDER_PAGE_COMPLETE, payload: {
                        products: products,
                        driver_id: driver_id,
                        driver_name: driver_name,
                        status: status,
                        delivery_location: delivery_location,
                        ordered_at: ordered_at,
                        store_user_id: store_user_id,
                        store_name: store_name,
                        customer_user_id: customer_user_id,
                        customer_name: customer_name,
                        country: country,
                        delivery_fee: delivery_fee,
                        delivery_fee_currency: delivery_fee_currency,
                        order_type: order_type,
                        store_confirmation_status: store_confirmation_status,
                        store_handles_delivery: store_handles_delivery,
                        customer_canceled_order: customer_canceled_order,
                        order_canceled_reason: order_canceled_reason,
                        store_fulfilled_order: store_fulfilled_order,
                        driver_fulfilled_order: driver_fulfilled_order,
                        total_price: total_price,
                        total_price_currency: total_price_currency,
                        delivery_time_limit: delivery_time_limit,
                        store_arrival_time_limit: store_arrival_time_limit,
                        receipt_url: receipt_url,
                        confirmed_by: confirmed_by,
                        canceled_by: canceled_by,
                        resolve_time_limit: resolve_time_limit,
                        store_payments: store_payments,
                        driver_payments: driver_payments
                    }});


                }else{

                    history.push("/orders");

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