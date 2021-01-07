import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    CLEAR_POST_CASES_STATE,
    GET_POST_CASES,
    GET_POST_CASES_ROUTE,
    GET_POST_CASES_COMPLETE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";

export const clearPostCasesState = () => {

    return{
      type: CLEAR_POST_CASES_STATE
    };

};


export const getPostCases = (limit, access_token, client, uid, history) => {

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

        dispatch({type: GET_POST_CASES});

        axios.post(GET_POST_CASES_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const review_status_options = data.review_status_options;

                const post_cases = data.post_cases;


                dispatch({type: GET_POST_CASES_COMPLETE, payload: {
                    review_status_options: review_status_options,
                    post_cases: post_cases
                }});

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