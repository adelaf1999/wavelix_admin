import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_CUSTOMER_ACCOUNTS,
    GET_CUSTOMER_ACCOUNTS_COMPLETE,
    GET_CUSTOMER_ACCOUNTS_ROUTE,
    CLEAR_CUSTOMER_ACCOUNTS_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";
import _ from "lodash";

export const clearCustomerAccountsState = () => {

    return{
      type: CLEAR_CUSTOMER_ACCOUNTS_STATE
    };

};

export const getCustomerAccounts = (limit, access_token, client, uid, history) => {

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

        dispatch({type: GET_CUSTOMER_ACCOUNTS});

        axios.post(GET_CUSTOMER_ACCOUNTS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const customer_accounts = data.customer_accounts;

                // console.log(customer_accounts);

                dispatch({type: GET_CUSTOMER_ACCOUNTS_COMPLETE, payload: customer_accounts});


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

