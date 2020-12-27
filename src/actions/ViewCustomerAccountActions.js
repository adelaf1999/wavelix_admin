import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_CUSTOMER_ACCOUNT_ROUTE,
    GET_CUSTOMER_DATA,
    GET_CUSTOMER_DATA_COMPLETE,
    CLEAR_VIEW_CUSTOMER_ACCOUNT_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const clearViewCustomerAccountState = () => {

    return{
      type: CLEAR_VIEW_CUSTOMER_ACCOUNT_STATE
    };

};

export const getCustomerData = (customer_user_id, access_token, client, uid, history) => {

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
           customer_user_id: customer_user_id
        });

        dispatch({type: GET_CUSTOMER_DATA});

        axios.post(VIEW_CUSTOMER_ACCOUNT_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const full_name = data.full_name;

                    const email = data.email;

                    const username = data.username;

                    const building_name = data.building_name;

                    const apartment_floor = data.apartment_floor;

                    const country = data.country;

                    const phone_number = data.phone_number;

                    const current_sign_in_ip = data.current_sign_in_ip;

                    const last_sign_in_ip = data.last_sign_in_ip;

                    dispatch({type: GET_CUSTOMER_DATA_COMPLETE, payload: {
                        full_name: full_name,
                        email: email,
                        username: username,
                        building_name: building_name,
                        apartment_floor: apartment_floor,
                        country: country,
                        phone_number: phone_number,
                        current_sign_in_ip: current_sign_in_ip,
                        last_sign_in_ip: last_sign_in_ip
                    }});


                }else{

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
