import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    NEW_ADMIN_ACCOUNT_ROUTE,
    INITIALIZE_NEW_ADMIN_ACCOUNT,
    INITIALIZE_NEW_ADMIN_ACCOUNT_COMPLETE,
    CLEAR_CREATE_ADMIN_ACCOUNT_STATE,
    CREATE_ADMIN_ACCOUNT_ROUTE,
    CREATE_ADMIN_ACCOUNT,
    CREATE_ADMIN_ACCOUNT_SUCCESS,
    CREATE_ADMIN_ACCOUNT_FAILURE,
    CREATE_ADMIN_EMAIL_ERROR,
    CREATE_ADMIN_PASSWORD_ERROR,
    CREATE_ADMIN_FULL_NAME_ERROR,
    CREATE_ADMIN_PHOTO_ERROR,
    CREATE_ADMIN_ROLES_ERROR,
    CREATE_ADMIN_ERROR,
    CLOSE_CREATE_ADMIN_SUCCESS_MODAL,
    CLEAR_CREATE_ADMIN_ACCOUNT_ERRORS
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";
import validator from "email-validator";
import _ from "lodash";

export const closeCreateAdminSuccessModal = () => {

    return{
      type: CLOSE_CREATE_ADMIN_SUCCESS_MODAL
    };

};

export const createAdminAccount = (email, password, full_name, profile_photo, roles, access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };


        dispatch({type: CLEAR_CREATE_ADMIN_ACCOUNT_ERRORS});

        let is_valid = true;


        if(_.isEmpty(email) || !validator.validate(email)){


            is_valid = false;

            dispatch({type: CREATE_ADMIN_EMAIL_ERROR, payload: 'Email is invalid'});


        }

        if(_.isEmpty(password) || password.length < 8){

            is_valid = false;

            dispatch({type: CREATE_ADMIN_PASSWORD_ERROR, payload: 'Password is invalid'});

        }

        if(_.isEmpty(full_name)){

            is_valid = false;

            dispatch({type: CREATE_ADMIN_FULL_NAME_ERROR, payload: 'Full name is invalid'});

        }


        if( profile_photo === null){

            is_valid = false;

            dispatch({type: CREATE_ADMIN_PHOTO_ERROR, payload: 'Profile photo is invalid'});

        }

        if(roles.length === 0){

            is_valid = false;

            dispatch({type: CREATE_ADMIN_ROLES_ERROR, payload: 'Select at least one role'});

        }

        if(is_valid){

            dispatch({type: CREATE_ADMIN_ACCOUNT});


            roles = JSON.stringify(roles);

            let bodyFormData = getFormData({
                email: email,
                password: password,
                full_name: full_name,
                profile_photo: profile_photo,
                roles: roles
            });



            axios.post(CREATE_ADMIN_ACCOUNT_ROUTE, bodyFormData, config)
                .then(response => {

                    const data = response.data;

                    const success = data.success;

                    if(success){

                        dispatch({type: CREATE_ADMIN_ACCOUNT_SUCCESS});

                    }else{

                        const error_code = data.error_code;

                        const message = data.message;

                        if(error_code === 0){

                            dispatch({type: CREATE_ADMIN_EMAIL_ERROR, payload: message});

                        }else if(error_code === 1){

                            dispatch({type: CREATE_ADMIN_PASSWORD_ERROR, payload: message});

                        }else if(error_code === 2){

                            dispatch({type: CREATE_ADMIN_FULL_NAME_ERROR, payload: message});

                        }else if(error_code === 3){

                            dispatch({type: CREATE_ADMIN_PHOTO_ERROR, payload: message});

                        }else if(error_code === 4){

                            dispatch({type: CREATE_ADMIN_ROLES_ERROR, payload: message});

                        }else if(error_code === 5){

                            dispatch({type: CREATE_ADMIN_ERROR, payload: message});
                        }



                        dispatch({type: CREATE_ADMIN_ACCOUNT_FAILURE});


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


        }









    };

};

export const clearCreateAdminAccountState = () => {

    return{
      type: CLEAR_CREATE_ADMIN_ACCOUNT_STATE
    };

};

export const initializeNewAdminAccount = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        dispatch({type: INITIALIZE_NEW_ADMIN_ACCOUNT});


        axios.get(NEW_ADMIN_ACCOUNT_ROUTE, config)
            .then(response => {

                const data = response.data;

                const available_roles = data.available_roles;

                console.log(available_roles);

                dispatch({type: INITIALIZE_NEW_ADMIN_ACCOUNT_COMPLETE, payload: available_roles});

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