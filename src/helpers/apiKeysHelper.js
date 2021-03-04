export const getRecaptchaSiteKey = () => {

    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){

        return process.env.REACT_APP_DEV_RECAPTCHA_SITE_KEY;

    }else{

        return process.env.REACT_APP_PROD_RECAPTCHA_SITE_KEY;

    }


};