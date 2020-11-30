import {
    CHECK_EMAIL,
    CHECK_EMAIL_FAILURE,
    CHECK_EMAIL_SUCCESS,
    CHECK_EMAIL_ROUTE,
    LOGIN_ADMIN,
    LOGIN_ADMIN_ROUTE,
    LOGIN_ADMIN_FAILURE,
    LOGIN_ADMIN_SUCCESS,
    LOGIN_PAGE_CHANGED
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const loginPageChanged = (page) => {

    return{
        type: LOGIN_PAGE_CHANGED,
        payload: page
    }

};

export const loginAdmin = (email, password, verification_code, history) => {

    return(dispatch) => {

        dispatch({type: LOGIN_ADMIN});

        const config = {
            headers: {
                "Accept": "application/json"
            }
        };


        let bodyFormData = getFormData({
            email: email,
            password: password,
            verification_code: verification_code
        });


        axios.post(LOGIN_ADMIN_ROUTE, bodyFormData, config)
            .then(response => {


                const headers = response.headers;

                const access_token = headers["access-token"];

                const client = headers["client"];

                const uid = headers["uid"];

                dispatch({type: LOGIN_ADMIN_SUCCESS, payload: {
                    access_token: access_token,
                    client: client,
                    uid: uid
                }});

                history.push("/home");


            }).catch(error => {

            const errors = error.response.data.errors;

            dispatch({ type: LOGIN_ADMIN_FAILURE, payload: errors });

        });

    };

};

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