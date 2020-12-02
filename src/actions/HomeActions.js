import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    INITIALIZE_HOME_PAGE,
    INITIALIZE_HOME_PAGE_COMPLETE,
    INITIALIZE_HOME_PAGE_ROUTE
} from "./types";

import axios from "axios";


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
