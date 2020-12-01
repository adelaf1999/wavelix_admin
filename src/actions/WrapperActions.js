import {
    GET_ROLES_ROUTE,
    GET_ROLES_COMPLETE,
    LOGOUT_SUCCESS
} from "./types";
import axios from "axios";


export const getRoles = (access_token, client, uid, history) => {

    return(dispatch) => {

        const config = {
            headers: {
                "access-token": access_token,
                "client": client,
                "uid": uid,
                "Accept": "application/json"
            }
        };

        axios.get(GET_ROLES_ROUTE, config)
            .then(response => {

                const data = response.data;

                const roles = data.roles;

                // console.log(roles);

                dispatch({type: GET_ROLES_COMPLETE, payload: roles});

            })
            .catch(error => {

                if(error.response !== undefined){

                    const status = error.response.status;

                    if(status === 401 || status === 404 || status === 500){

                        dispatch({type: LOGOUT_SUCCESS});

                        history.push("/");

                    }

                }

            })

    };

};