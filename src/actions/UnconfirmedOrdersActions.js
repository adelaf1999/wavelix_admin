import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    UNCONFIRMED_ORDERS_INDEX_ROUTE,
    INITIALIZE_UNCONFIRMED_ORDERS_PAGE,
    INITIALIZE_UNCONFIRMED_ORDERS_PAGE_COMPLETE,
    CLEAR_UNCONFIRMED_ORDERS_STATE
} from "./types";

import axios from "axios";

export const clearUnconfirmedOrdersState = () => {

    return{
      type: CLEAR_UNCONFIRMED_ORDERS_STATE
    };

};

export const initializeUnconfirmedOrdersPage = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        dispatch({type: INITIALIZE_UNCONFIRMED_ORDERS_PAGE});

        axios.get(UNCONFIRMED_ORDERS_INDEX_ROUTE, config)
            .then(response => {

                const data = response.data;

                const time_exceeded_filters = data.time_exceeded_filters;

                const unconfirmed_orders = data.unconfirmed_orders;

                const countries = data.countries;


                dispatch({type: INITIALIZE_UNCONFIRMED_ORDERS_PAGE_COMPLETE, payload: {
                    time_exceeded_filters: time_exceeded_filters,
                    unconfirmed_orders: unconfirmed_orders,
                    countries: countries
                }});


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