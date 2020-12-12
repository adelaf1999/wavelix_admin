import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    INITIALIZE_STORE_ACCOUNTS_PAGE,
    INITIALIZE_STORE_ACCOUNTS_PAGE_COMPLETE,
    GET_STORE_ACCOUNTS_ROUTE,
    CLEAR_STORE_ACCOUNTS_STATE,
    SEARCH_STORE_ACCOUNTS_ROUTE,
    SEARCH_STORE_ACCOUNTS_COMPLETE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";
import _ from "lodash";

export const searchStoreAccounts = (limit, search, selected_country, selected_account_status, selected_review_status, access_token, client, uid, history) => {

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
            search: search
        };

        if(!_.isEmpty(selected_country)){

            data.country = selected_country;

        }

        if(!_.isEmpty(selected_account_status)){

            data.status = selected_account_status;

        }

        if(!_.isEmpty(selected_review_status)){

            data.review_status = selected_review_status;

        }

        _.each(data, (value, key) => {

            bodyFormData.append(key, value);

        });

        axios.post(SEARCH_STORE_ACCOUNTS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const store_accounts = data.store_accounts;

                dispatch({type: SEARCH_STORE_ACCOUNTS_COMPLETE, payload: store_accounts});


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

export const clearStoreAccountsState = () => {

    return{
      type: CLEAR_STORE_ACCOUNTS_STATE
    };

};

export const initializeStoreAccountsPage = (limit, access_token, client, uid, history ) => {

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

        dispatch({type: INITIALIZE_STORE_ACCOUNTS_PAGE});

        axios.post(GET_STORE_ACCOUNTS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const store_accounts = data.store_accounts;

                const account_status_options = data.account_status_options;


                const review_status_options = data.review_status_options;

                const countries = data.countries;


                dispatch({type: INITIALIZE_STORE_ACCOUNTS_PAGE_COMPLETE, payload: {
                    store_accounts: store_accounts,
                    account_status_options: account_status_options,
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