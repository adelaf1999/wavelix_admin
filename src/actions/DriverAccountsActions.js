import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_DRIVER_ACCOUNTS_ROUTE,
    INITIALIZE_DRIVER_ACCOUNTS_PAGE,
    INITIALIZE_DRIVER_ACCOUNTS_PAGE_COMPLETE,
    CLEAR_DRIVER_ACCOUNTS_STATE
} from "./types";

import axios from "axios";

import { getFormData } from "../helpers";


export const clearDriverAccountsPage = () => {

    return{
      type: CLEAR_DRIVER_ACCOUNTS_STATE
    };

};

export const initializeDriverAccountsPage = (limit, access_token, client, uid, history) => {

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

        dispatch({type: INITIALIZE_DRIVER_ACCOUNTS_PAGE});

        axios.post(GET_DRIVER_ACCOUNTS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const driver_accounts = data.driver_accounts;

                const review_status_options = data.review_status_options;

                const countries = data.countries;


                dispatch({type: INITIALIZE_DRIVER_ACCOUNTS_PAGE_COMPLETE, payload: {
                    driver_accounts: driver_accounts,
                    review_status_options: review_status_options,
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