import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    INITIALIZE_HOME_PAGE,
    INITIALIZE_HOME_PAGE_COMPLETE,
    INITIALIZE_HOME_PAGE_ROUTE,
    CHANGE_MY_EMAIL_ROUTE,
    CHANGE_CREDENTIAL,
    CHANGE_MY_EMAIL_SUCCESS,
    CHANGE_CREDENTIAL_ERROR,
    OPEN_CREDENTIAL_MODAL,
    CLOSE_CREDENTIAL_MODAL,
    CHANGE_MY_PASSWORD_ROUTE,
    CHANGE_MY_PASSWORD_SUCCESS,
    CLEAR_HOME_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const clearHomeState = () => {
    return{
      type: CLEAR_HOME_STATE
    };
};

export const closeCredentialModal = () => {

    return{
      type: CLOSE_CREDENTIAL_MODAL
    };

};

export const openCredentialModal = () => {

    return{
      type: OPEN_CREDENTIAL_MODAL
    };

};


export const changeMyPassword = (password, access_token, client, uid, history) => {

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
            password: password
        });

        dispatch({type: CHANGE_CREDENTIAL});

        axios.post(CHANGE_MY_PASSWORD_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                  dispatch({type: CHANGE_MY_PASSWORD_SUCCESS});

                }else{

                    const message = data.message;

                    dispatch({type: CHANGE_CREDENTIAL_ERROR, payload: message});

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

export const changeMyEmail = (email, access_token, client, uid, history) => {

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
            email: email
        });

        dispatch({type: CHANGE_CREDENTIAL});

        axios.post(CHANGE_MY_EMAIL_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const new_email = data.email;

                    const new_uid = data.uid;

                    console.log(new_email);

                    console.log(new_uid);

                    dispatch({type: CHANGE_MY_EMAIL_SUCCESS, payload: {
                        email: new_email,
                        uid: new_uid
                    }});

                }else{

                    const message = data.message;

                    dispatch({type: CHANGE_CREDENTIAL_ERROR, payload: message});

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

export const initializeHomePage = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };


        dispatch({type: INITIALIZE_HOME_PAGE});

        axios.get(INITIALIZE_HOME_PAGE_ROUTE, config)
            .then(response => {

                const data = response.data;

                const profile_photo = data.profile_photo;

                const name = data.name;

                const email = data.email;

                dispatch({type: INITIALIZE_HOME_PAGE_COMPLETE, payload: {
                    profile_photo: profile_photo,
                    name: name,
                    email: email
                }});



            })
            .catch(error => {

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
