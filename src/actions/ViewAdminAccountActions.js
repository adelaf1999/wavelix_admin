import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_ADMIN_ACCOUNT_ROUTE,
    VIEW_ADMIN_ACCOUNT,
    VIEW_ADMIN_ACCOUNT_FAILURE,
    VIEW_ADMIN_ACCOUNT_SUCCESS,
    CLEAR_VIEW_ADMIN_ACCOUNT_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const clearViewAdminAccountState = () => {

    return{
      type: CLEAR_VIEW_ADMIN_ACCOUNT_STATE
    };

};

export const viewAdminAccount = (admin_id, access_token, client, uid, history) => {

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
            admin_id: admin_id
        });

        dispatch({type: VIEW_ADMIN_ACCOUNT});


        axios.post(VIEW_ADMIN_ACCOUNT_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const admin_profile_photo = data.admin_profile_photo;

                    const admin_full_name = data.admin_full_name;

                    const admin_email = data.admin_email;

                    const admin_roles = data.admin_roles;

                    const available_roles = data.available_roles;

                    const current_sign_in_ip = data.current_sign_in_ip;

                    const last_sign_in_ip = data.last_sign_in_ip;


                    console.log(current_sign_in_ip);

                    console.log(last_sign_in_ip);



                    dispatch({type: VIEW_ADMIN_ACCOUNT_SUCCESS, payload: {
                        admin_profile_photo: admin_profile_photo,
                        admin_full_name: admin_full_name,
                        admin_email: admin_email,
                        admin_roles: admin_roles,
                        available_roles: available_roles,
                        current_sign_in_ip: current_sign_in_ip,
                        last_sign_in_ip: last_sign_in_ip
                    }})


                }else{

                    dispatch({type: VIEW_ADMIN_ACCOUNT_FAILURE});

                    history.goBack();

                }



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