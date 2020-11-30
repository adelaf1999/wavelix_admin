export const BACKEND_DOMAIN =  ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development')  ?  "localhost:3000" : 'api.wavelix.com';
export const BACKEND_URL =  `${ ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http' : 'https'}://${BACKEND_DOMAIN}`;


export const CHECK_EMAIL_ROUTE = `${BACKEND_URL}/check-admin-email`;


export const CHECK_EMAIL = "check_email";
export const CHECK_EMAIL_SUCCESS = "check_email_success";
export const CHECK_EMAIL_FAILURE = "check_email_failure";

export const LOGOUT_SUCCESS = "logout_success";