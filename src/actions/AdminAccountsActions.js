import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_ADMIN_ACCOUNTS,
    GET_ADMIN_ACCOUNTS_COMPLETE,
    GET_ADMIN_ACCOUNTS_ROUTE,
    CLEAR_ADMIN_ACCOUNTS_STATE,
    SEARCH_ADMIN_ROUTE,
    SEARCH_ADMINS,
    SEARCH_ADMINS_COMPLETE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";
import _ from "lodash";


export const searchAdmins = (limit, search, role, access_token, client, uid, history) => {

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
            search: search,
            limit: limit
        };

        if(!_.isEmpty(role)){

            data.role = role;

        }

        _.each(data, (value, key) => {

            bodyFormData.append(key, value);

        });


        dispatch({type: SEARCH_ADMINS});

        axios.post(SEARCH_ADMIN_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const admins = data.admins;

                dispatch({type: SEARCH_ADMINS_COMPLETE, payload: admins});

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



export const clearAdminAccountsState = () => {

    return{
        type: CLEAR_ADMIN_ACCOUNTS_STATE
    };

};


export const getAdminAccounts = (limit, access_token, client, uid, history) => {

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

        dispatch({type: GET_ADMIN_ACCOUNTS});

        axios.post(GET_ADMIN_ACCOUNTS_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const admins = data.admins;

                const available_roles = data.available_roles;

                console.log(admins);
                //
                // console.log(available_roles);


                dispatch({type: GET_ADMIN_ACCOUNTS_COMPLETE, payload: {
                    admins: admins,
                    available_roles: available_roles
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