export const BACKEND_DOMAIN =  ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development')  ?  "localhost:3000" : 'api.wavelix.com';
export const BACKEND_URL =  `${ ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http' : 'https'}://${BACKEND_DOMAIN}`;

export const CHECK_EMAIL_ROUTE = `${BACKEND_URL}/check-admin-email`;
export const LOGIN_ADMIN_ROUTE = `${BACKEND_URL}/admin_auth/sign_in`;
export const RESEND_VERIFICATION_CODE_ROUTE = `${BACKEND_URL}/resend-admin-verification-code`;
export const RESEND_UNLOCK_LINK_ROUTE = `${BACKEND_URL}/admin_auth/unlock`;
export const VERIFY_RECAPTCHA_TOKEN_ROUTE = `${BACKEND_URL}/verify-recaptcha-token`;
export const LOGOUT_ROUTE = `${BACKEND_URL}/admin_auth/sign_out`;
export const GET_ROLES_ROUTE = `${BACKEND_URL}/get-admin-roles`;


// Login Types
export const CHECK_EMAIL = "check_email";
export const CHECK_EMAIL_SUCCESS = "check_email_success";
export const CHECK_EMAIL_FAILURE = "check_email_failure";
export const LOGIN_ADMIN = "login_admin";
export const LOGIN_ADMIN_SUCCESS = "login_admin_success";
export const LOGIN_ADMIN_FAILURE = "login_admin_failure";
export const LOGIN_PAGE_CHANGED = "login_page_changed";
export const RESEND_AUTH_EMAIL = "resend_auth_email";
export const RESEND_AUTH_EMAIL_COMPLETE = "resend_auth_email_complete";
export const CLOSE_EMAIL_MODAL = "close_email_modal";
export const LOGOUT_SUCCESS = "logout_success";

// Wrapper Types
export const GET_ROLES_COMPLETE = "get_roles_complete";