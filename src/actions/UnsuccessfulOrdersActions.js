import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    UNSUCCESSFUL_ORDERS_INDEX_ROUTE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE,
    CLEAR_UNSUCCESSFUL_ORDERS_STATE
} from "./types";

import axios from "axios";
import _ from "lodash";

export const clearUnsuccessfulOrdersState = () => {

    return{
      type: CLEAR_UNSUCCESSFUL_ORDERS_STATE
    };

};

export const initializeUnsuccessfulOrdersPage = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        dispatch({type: INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE});

        axios.get(UNSUCCESSFUL_ORDERS_INDEX_ROUTE, config)
            .then(response => {

                const data = response.data;

                const drivers = data.drivers;

                const countries = data.countries;

                console.log(drivers);

                console.log(countries);

                dispatch({type: INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE, payload: {
                    drivers: drivers,
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
