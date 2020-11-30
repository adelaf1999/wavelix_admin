import {
    CHECK_EMAIL,
    CHECK_EMAIL_FAILURE,
    CHECK_EMAIL_SUCCESS,
    CHECK_EMAIL_ROUTE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const checkEmail = (email) => {

    return(dispatch) => {

        dispatch({type: CHECK_EMAIL});

        const config = {
            headers: {
                "Accept": "application/json"
            }
        };


        let bodyFormData = getFormData({
            email: email
        });

        axios.post(CHECK_EMAIL_ROUTE, bodyFormData, config)
            .then(response => {

                console.log(response);

                const data = response.data;

                const success = data.success;

                if(success){

                    dispatch({type: CHECK_EMAIL_SUCCESS});

                }else{

                    const message = data.message;

                    dispatch({type: CHECK_EMAIL_FAILURE, payload: message});

                }


            }).catch(error => {
            console.log(error);
        });

    };

};