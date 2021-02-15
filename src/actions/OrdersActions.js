import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    ORDERS_INDEX_ROUTE,
    INITIALIZE_ORDERS_PAGE,
    INITIALIZE_ORDERS_PAGE_COMPLETE,
    CLEAR_ORDERS_PAGE_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

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