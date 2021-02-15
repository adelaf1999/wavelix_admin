import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    ORDERS_INDEX_ROUTE,
    INITIALIZE_ORDERS_PAGE,
    INITIALIZE_ORDERS_PAGE_COMPLETE,
    CLEAR_ORDERS_PAGE_STATE,
    SEARCH_ORDERS_ROUTE,
    SEARCH_ORDERS_COMPLETE,
    SEARCH_ORDERS_LIMIT_CHANGED
} from "./types";

import _ from "lodash";
import axios from "axios";
import { getFormData } from "../helpers";

export const searchOrdersLimitChanged = (limit) => {

    return{
      type: SEARCH_ORDERS_LIMIT_CHANGED,
      payload: limit
    };

};

export const searchOrders = (access_token, client, uid, history, limit, store_name, customer_name, status, country, store_handles_delivery ) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        let bodyFormData = new FormData();

        let data = {
            limit: limit,
            store_name: store_name,
            customer_name: customer_name
        };


        if(!_.isEmpty(status)){

            data.status = status;

        }


        if(!_.isEmpty(country)){

            data.country = country;

        }


        if(_.isBoolean(store_handles_delivery)){

            data.store_handles_delivery = store_handles_delivery;

        }


        _.each(data, (value, key) => {

            bodyFormData.append(key, value);

        });


        axios.post(SEARCH_ORDERS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const orders = data.orders;

                dispatch({type: SEARCH_ORDERS_COMPLETE, payload: orders});


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


export const clearOrdersPageState = () => {

    return{
      type: CLEAR_ORDERS_PAGE_STATE
    };

};

export const initializeOrdersPage = (access_token, client, uid, history, limit) => {

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
            limit: limit
        });

        dispatch({type: INITIALIZE_ORDERS_PAGE});

        axios.post(ORDERS_INDEX_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const orders = data.orders;

                const status_options = data.status_options;

                const countries = data.countries;


                dispatch({type: INITIALIZE_ORDERS_PAGE_COMPLETE, payload: {
                    orders: orders,
                    status_options: status_options,
                    countries: countries
                }})


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