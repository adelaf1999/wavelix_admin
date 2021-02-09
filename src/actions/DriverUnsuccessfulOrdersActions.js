import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_DRIVER_UNSUCCESSFUL_ORDERS_ROUTE,
    INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE,
    INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE,
    CLEAR_DRIVER_UNSUCCESSFUL_ORDERS_STATE,
    DRIVER_UNSUCCESSFUL_ORDERS_RESOLVERS_CHANGED,
    DRIVER_UNSUCCESSFUL_ORDERS_UPDATED
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";
import _ from "lodash";

export const driverUnsuccessfulOrdersUpdated = (unsuccessful_orders) => {

    return{
        type: DRIVER_UNSUCCESSFUL_ORDERS_UPDATED,
        payload: unsuccessful_orders
    };

};

export const driverUnsuccessfulOrdersResolversChanged = (current_resolvers) => {

    return{
        type: DRIVER_UNSUCCESSFUL_ORDERS_RESOLVERS_CHANGED,
        payload: current_resolvers
    };

};

export const clearDriverUnsuccessfulOrdersState = () => {

    return{
        type: CLEAR_DRIVER_UNSUCCESSFUL_ORDERS_STATE
    };

};


export const initializeDriverUnsuccessfulOrdersPage = (access_token, client, uid, history, driver_id) => {

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
            driver_id: driver_id
        });

        dispatch({type: INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE});

        axios.post(VIEW_DRIVER_UNSUCCESSFUL_ORDERS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const unsuccessful_orders = data.unsuccessful_orders;

                    const driver_name = data.driver_name;

                    const driver_phone_number = data.driver_phone_number;

                    const driver_country = data.driver_country;

                    const driver_account_status = data.driver_account_status;

                    const driver_balance_usd = data.driver_balance_usd;

                    const driver_latitude = data.driver_latitude;

                    const driver_longitude = data.driver_longitude;

                    console.log(unsuccessful_orders);


                    dispatch({type: INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE, payload: {
                        unsuccessful_orders: unsuccessful_orders,
                        driver_name: driver_name,
                        driver_phone_number: driver_phone_number,
                        driver_country: driver_country,
                        driver_account_status: driver_account_status,
                        driver_balance_usd: driver_balance_usd,
                        driver_latitude: driver_latitude,
                        driver_longitude: driver_longitude
                    }});


                }else{

                    history.push("/unsuccessful-orders");

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
