import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    GET_USER_PROFILES_ROUTE,
    GET_USER_PROFILES,
    GET_USER_PROFILES_COMPLETE,
    CLEAR_USER_PROFILES_STATE,
    SEARCH_USER_PROFILES_ROUTE,
    SEARCH_USER_PROFILES_COMPLETE,
    SEARCH_USER_PROFILES_LIMIT_CHANGED
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const searchUserProfilesLimitChanged = (limit) => {

    return{
      type: SEARCH_USER_PROFILES_LIMIT_CHANGED,
      payload: limit
    };

};

export const searchUserProfiles = (limit, search, access_token, client, uid, history ) => {

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
            search: search,
            limit: limit
        });

        axios.post(SEARCH_USER_PROFILES_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const profiles = data.profiles;

                dispatch({type: SEARCH_USER_PROFILES_COMPLETE, payload: profiles});


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

export const clearUserProfilesState = () => {

    return{
      type: CLEAR_USER_PROFILES_STATE
    };

};

export const getUserProfiles = (limit, access_token, client, uid, history) => {

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

        dispatch({type: GET_USER_PROFILES});

        axios.post(GET_USER_PROFILES_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const profiles = data.profiles;

                // console.log(profiles);

                dispatch({type: GET_USER_PROFILES_COMPLETE, payload: profiles});


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