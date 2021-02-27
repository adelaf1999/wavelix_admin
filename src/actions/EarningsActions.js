import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    EARNINGS_INDEX_ROUTE,
    GET_YEAR_EARNINGS_ROUTE,
    INITIALIZE_EARNINGS_PAGE,
    INITIALIZE_EARNINGS_PAGE_COMPLETE,
    CLEAR_EARNINGS_PAGE_STATE
} from "./types";

import axios from "axios";
import { getFormData } from "../helpers";


export const clearEarningsPageState = () => {

    return{
      type: CLEAR_EARNINGS_PAGE_STATE
    };

};


export const initializeEarningsPage = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };


        dispatch({type: INITIALIZE_EARNINGS_PAGE});

        axios.get(EARNINGS_INDEX_ROUTE, config)
            .then(response => {

                const data = response.data;

                const earnings = data.earnings;

                const years = data.years;

                const total = data.total;

                console.log(earnings);

                console.log(years);

                console.log(total);

                dispatch({type: INITIALIZE_EARNINGS_PAGE_COMPLETE, payload: {
                    earnings: earnings,
                    years: years,
                    total: total
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