import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_ADMIN_ACCOUNTS,
    GET_ADMIN_ACCOUNTS_COMPLETE,
    GET_ADMIN_ACCOUNTS_ROUTE,
    CLEAR_ADMIN_ACCOUNTS_STATE
} from "./types";

import axios from "axios";

export const clearAdminAccountsState = () => {

    return{
      type: CLEAR_ADMIN_ACCOUNTS_STATE
    };

};


export const getAdminAccounts = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        dispatch({type: GET_ADMIN_ACCOUNTS});

        axios.get(GET_ADMIN_ACCOUNTS_ROUTE, config)
            .then(response => {

                const data = response.data;

                const admins = data.admins;

                const available_roles = data.available_roles;

                // console.log(admins);
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