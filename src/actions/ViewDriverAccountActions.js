import {
    LOGOUT_SUCCESS,
    OPEN_TIMEOUT_MODAL,
    VIEW_DRIVER_ACCOUNT_ROUTE,
    GET_DRIVER_DATA,
    GET_DRIVER_DATA_COMPLETE,
    CLEAR_VIEW_DRIVER_ACCOUNT_STATE,
    DRIVER_ACCOUNT_REVIEWERS_CHANGED,
    DRIVER_ACCOUNT_ADMINS_DECLINED_CHANGED,
    DRIVER_ACCOUNT_REVIEW_STATUS_CHANGED,
    DRIVER_ACCOUNT_UNVERIFIED_REASONS_CHANGED,
    DRIVER_ACCOUNT_DRIVER_VERIFIED_CHANGED,
    DRIVER_ACCOUNT_VERIFIED_BY_CHANGED,
    DECLINE_DRIVER_VERIFICATION_ROUTE
} from "./types";

import axios from "axios";

import { getFormData } from "../helpers";

export const declineDriverVerification = (driver_id, declined_reason, access_token, client, uid, history) => {

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
            driver_id: driver_id,
            declined_reason: declined_reason
        });

        axios.post(DECLINE_DRIVER_VERIFICATION_ROUTE, bodyFormData, config)
            .then(response => {

                console.log(response);

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

export const driverAccountVerifiedByChanged = (verified_by) => {

    return{
      type: DRIVER_ACCOUNT_VERIFIED_BY_CHANGED,
      payload: verified_by
    };

};

export const driverAccountDriverVerifiedChanged = (driver_verified) => {

    return{
      type: DRIVER_ACCOUNT_DRIVER_VERIFIED_CHANGED,
      payload: driver_verified
    };

};

export const driverAccountUnverifiedReasonsChanged = (unverified_reasons) => {

    return{
        type: DRIVER_ACCOUNT_UNVERIFIED_REASONS_CHANGED,
        payload: unverified_reasons
    };

};

export const driverAccountReviewStatusChanged = (review_status) => {

    return{
        type: DRIVER_ACCOUNT_REVIEW_STATUS_CHANGED,
        payload: review_status
    };

};

export const driverAccountAdminsDeclinedChanged = (admins_declined) => {

    return{
        type: DRIVER_ACCOUNT_ADMINS_DECLINED_CHANGED,
        payload: admins_declined
    };

};

export const driverAccountReviewersChanged = (current_reviewers) => {

    return{
        type: DRIVER_ACCOUNT_REVIEWERS_CHANGED,
        payload: current_reviewers
    };

};


export const clearViewDriverAccountState = () => {

    return{
        type: CLEAR_VIEW_DRIVER_ACCOUNT_STATE
    };

};


export const getDriverData = (driver_id, access_token, client, uid, history) => {

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
            driver_id: driver_id
        });

        dispatch({type: GET_DRIVER_DATA});

        axios.post(VIEW_DRIVER_ACCOUNT_ROUTE, bodyFormData, config)
            .then(response => {

                const data = response.data;

                const success = data.success;

                if(success){

                    const profile_picture = data.profile_picture;

                    const name = data.name;

                    const phone_number = data.phone_number;

                    const country = data.country;

                    const driver_verified = data.driver_verified;

                    const account_blocked = data.account_blocked;

                    const review_status = data.review_status;

                    const registered_at = data.registered_at;

                    const latitude = data.latitude;

                    const longitude = data.longitude;

                    const driver_license_pictures = data.driver_license_pictures;

                    const national_id_pictures = data.national_id_pictures;

                    const vehicle_registration_pictures = data.vehicle_registration_pictures;

                    const verified_by = data.verified_by;

                    const admins_declined = data.admins_declined;

                    const unverified_reasons = data.unverified_reasons;

                    const email = data.email;

                    dispatch({type: GET_DRIVER_DATA_COMPLETE, payload: {
                        profile_picture: profile_picture,
                        name: name,
                        phone_number: phone_number,
                        country: country,
                        driver_verified: driver_verified,
                        account_blocked: account_blocked,
                        review_status: review_status,
                        registered_at: registered_at,
                        latitude: latitude,
                        longitude: longitude,
                        driver_license_pictures: driver_license_pictures,
                        national_id_pictures: national_id_pictures,
                        vehicle_registration_pictures: vehicle_registration_pictures,
                        verified_by: verified_by,
                        admins_declined: admins_declined,
                        unverified_reasons: unverified_reasons,
                        email: email
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