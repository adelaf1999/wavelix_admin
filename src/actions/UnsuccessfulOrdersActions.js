import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    UNSUCCESSFUL_ORDERS_INDEX_ROUTE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE,
    INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE,
    CLEAR_UNSUCCESSFUL_ORDERS_STATE,
    SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_COMPLETE,
    SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_ROUTE,
    DRIVERS_UNSUCCESSFUL_ORDERS_CHANGED
} from "./types";

import axios from "axios";
import _ from "lodash";

export const driversUnsuccessfulOrdersChanged = (drivers) => {

    return{
      type: DRIVERS_UNSUCCESSFUL_ORDERS_CHANGED,
      payload: drivers
    };

};

export const searchDriversUnsuccessfulOrders = (access_token, client, uid, history, search, country) => {

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
            search: search
        };

        if(!_.isEmpty(country)){

            data.country = country;

        }

        _.each(data, (value, key) => {

            bodyFormData.append(key, value);

        });

        axios.post(SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const drivers = data.drivers;

                dispatch({type: SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_COMPLETE, payload: drivers});

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
