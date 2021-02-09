export const BACKEND_DOMAIN =  ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development')  ?  "localhost:3000" : 'api.wavelix.com';
export const BACKEND_URL =  `${ ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http' : 'https'}://${BACKEND_DOMAIN}`;

export const ACTION_CABLE_ROUTE = `ws://${BACKEND_DOMAIN}/cable`;
export const CHECK_EMAIL_ROUTE = `${BACKEND_URL}/check-admin-email`;
export const LOGIN_ADMIN_ROUTE = `${BACKEND_URL}/admin_auth/sign_in`;
export const RESEND_VERIFICATION_CODE_ROUTE = `${BACKEND_URL}/resend-admin-verification-code`;
export const RESEND_UNLOCK_LINK_ROUTE = `${BACKEND_URL}/admin_auth/unlock`;
export const VERIFY_RECAPTCHA_TOKEN_ROUTE = `${BACKEND_URL}/verify-recaptcha-token`;
export const LOGOUT_ROUTE = `${BACKEND_URL}/admin_auth/sign_out`;
export const GET_ROLES_ROUTE = `${BACKEND_URL}/get-admin-roles`;
export const INITIALIZE_HOME_PAGE_ROUTE = `${BACKEND_URL}/admin-home-index`;
export const CHANGE_MY_EMAIL_ROUTE = `${BACKEND_URL}/change-my-admin-email`;
export const CHANGE_MY_PASSWORD_ROUTE = `${BACKEND_URL}/change-my-admin-password`;
export const GET_ADMIN_ACCOUNTS_ROUTE = `${BACKEND_URL}/admins-accounts`;
export const SEARCH_ADMIN_ROUTE = `${BACKEND_URL}/search-admin`;
export const VIEW_ADMIN_ACCOUNT_ROUTE = `${BACKEND_URL}/view-admin-account`;
export const CHANGE_ADMIN_ACCOUNT_PASSWORD_ROUTE = `${BACKEND_URL}/change-admin-account-password`;
export const DESTROY_ADMIN_ACCOUNT_ROUTE = `${BACKEND_URL}/destroy-admin-account`;
export const CHANGE_ADMIN_ACCOUNT_ROLES_ROUTE = `${BACKEND_URL}/change-admin-account-roles`;
export const NEW_ADMIN_ACCOUNT_ROUTE = `${BACKEND_URL}/new-admin-account`;
export const CREATE_ADMIN_ACCOUNT_ROUTE = `${BACKEND_URL}/create-admin-account`;
export const GET_CUSTOMER_ACCOUNTS_ROUTE =  `${BACKEND_URL}/get-customer-accounts`;
export const SEARCH_CUSTOMER_ACCOUNTS_ROUTE = `${BACKEND_URL}/search-customer-accounts`;
export const VIEW_CUSTOMER_ACCOUNT_ROUTE = `${BACKEND_URL}/view-customer-account`;
export const GET_STORE_ACCOUNTS_ROUTE = `${BACKEND_URL}/get-store-accounts`;
export const SEARCH_STORE_ACCOUNTS_ROUTE = `${BACKEND_URL}/search-store-accounts`;
export const VIEW_STORE_ACCOUNT_ROUTE = `${BACKEND_URL}/view-store-account`;
export const ACCEPT_STORE_VERIFICATION_ROUTE = `${BACKEND_URL}/accept-store-verification`;
export const DECLINE_STORE_VERIFICATION_ROUTE = `${BACKEND_URL}/decline-store-verification`;
export const GET_DRIVER_ACCOUNTS_ROUTE = `${BACKEND_URL}/get-driver-accounts`;
export const SEARCH_DRIVER_ACCOUNTS_ROUTE = `${BACKEND_URL}/search-driver-accounts`;
export const VIEW_DRIVER_ACCOUNT_ROUTE = `${BACKEND_URL}/view-driver-account`;
export const DECLINE_DRIVER_VERIFICATION_ROUTE = `${BACKEND_URL}/decline-driver-verification`;
export const ACCEPT_DRIVER_VERIFICATION_ROUTE = `${BACKEND_URL}/accept-driver-verification`;
export const GET_USER_PROFILES_ROUTE = `${BACKEND_URL}/get-profiles`;
export const SEARCH_USER_PROFILES_ROUTE = `${BACKEND_URL}/search-user-profiles`;
export const VIEW_USER_PROFILE_ROUTE = `${BACKEND_URL}/get-profile`;
export const BLOCK_CUSTOMER_PROFILE_ROUTE = `${BACKEND_URL}/block-customer-profile`;
export const REQUEST_STORE_PROFILE_BLOCK_ROUTE = `${BACKEND_URL}/request-store-profile-block`;
export const TOGGLE_STORE_PROFILE_STATUS_ROUTE = `${BACKEND_URL}/toggle-store-profile-status`;
export const GET_POST_CASES_ROUTE = `${BACKEND_URL}/get-post-cases`;
export const SEARCH_POST_CASES_ROUTE = `${BACKEND_URL}/search-post-cases`;
export const VIEW_POST_CASE_ROUTE =  `${BACKEND_URL}/view-post-case`;
export const MARK_POST_SAFE_ROUTE = `${BACKEND_URL}/mark-post-safe`;
export const DELETE_UNSAFE_POST_ROUTE = `${BACKEND_URL}/destroy-unsafe-post`;
export const UNCONFIRMED_ORDERS_INDEX_ROUTE =  `${BACKEND_URL}/unconfirmed-orders-index`;
export const SEARCH_UNCONFIRMED_ORDERS_ROUTE = `${BACKEND_URL}/search-unconfirmed-orders`;
export const VIEW_UNCONFIRMED_ORDER_ROUTE = `${BACKEND_URL}/view-unconfirmed-order`;
export const CONFIRM_UNCONFIRMED_ORDER_ROUTE = `${BACKEND_URL}/confirm-unconfirmed-order`;
export const CANCEL_UNCONFIRMED_ORDER_ROUTE = `${BACKEND_URL}/cancel-unconfirmed-order`;
export const UNSUCCESSFUL_ORDERS_INDEX_ROUTE = `${BACKEND_URL}/unsuccessful-orders-index`;
export const SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_ROUTE =  `${BACKEND_URL}/search-drivers-unsuccessful-orders`;
export const VIEW_DRIVER_UNSUCCESSFUL_ORDERS_ROUTE = `${BACKEND_URL}/view-driver-unsuccessful-orders`;

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
export const OPEN_TIMEOUT_MODAL = "open_timeout_modal";
export const CLOSE_TIMEOUT_MODAL = "close_timeout_modal";
export const ROLES_CHANGED = "roles_changed";

// Wrapper Types
export const GET_ROLES_COMPLETE = "get_roles_complete";

// Home Types
export const INITIALIZE_HOME_PAGE = "initialize_home_page";
export const INITIALIZE_HOME_PAGE_COMPLETE = "initialize_home_page_complete";
export const CHANGE_CREDENTIAL = "change_credential";
export const CHANGE_MY_EMAIL_SUCCESS = "change_my_email_success";
export const CHANGE_MY_PASSWORD_SUCCESS = "change_my_password_success";
export const CHANGE_CREDENTIAL_ERROR = "change_credential_error";
export const OPEN_CREDENTIAL_MODAL = "open_credential_modal";
export const CLOSE_CREDENTIAL_MODAL = "close_credential_modal";
export const CLEAR_HOME_STATE = "clear_home_state";

// AdminAccounts Types
export const GET_ADMIN_ACCOUNTS = "get_admin_accounts";
export const GET_ADMIN_ACCOUNTS_COMPLETE = "get_admin_accounts_complete";
export const CLEAR_ADMIN_ACCOUNTS_STATE = "clear_admin_accounts_state";
export const SEARCH_ADMINS_COMPLETE = "search_admins_complete";
export const SEARCH_ADMINS_LIMIT_CHANGED = "search_admins_limit_changed";

//ViewAdminAccount Types
export const VIEW_ADMIN_ACCOUNT = "view_admin_account";
export const VIEW_ADMIN_ACCOUNT_SUCCESS = "view_admin_account_success";
export const VIEW_ADMIN_ACCOUNT_FAILURE = "view_admin_account_failure";
export const CLEAR_VIEW_ADMIN_ACCOUNT_STATE = "clear_view_admin_account_state";
export const CHANGE_ADMIN_ACCOUNT_PASSWORD = "change_admin_account_password";
export const CHANGE_ADMIN_ACCOUNT_PASSWORD_SUCCESS = "change_admin_account_password_success";
export const CHANGE_ADMIN_ACCOUNT_PASSWORD_FAILURE = "change_admin_account_password_failure";
export const OPEN_CHANGE_PASSWORD_MODAL = "open_change_password_modal";
export const CLOSE_CHANGE_PASSWORD_MODAL = "close_change_password_modal";
export const CHANGE_ADMIN_ACCOUNT_ROLES = "change_admin_account_roles";
export const CHANGE_ADMIN_ACCOUNT_ROLES_SUCCESS = "change_admin_account_roles_success";
export const CHANGE_ADMIN_ACCOUNT_ROLES_FAILURE = "change_admin_account_roles_failure";
export const OPEN_CHANGE_ROLES_MODAL = "open_change_roles_modal";
export const CLOSE_CHANGE_ROLES_MODAL = "close_change_roles_modal";

//CreateAdminAccount Types
export const INITIALIZE_NEW_ADMIN_ACCOUNT = "initialize_new_admin_account";
export const INITIALIZE_NEW_ADMIN_ACCOUNT_COMPLETE = "initialize_new_admin_account_complete";
export const CLEAR_CREATE_ADMIN_ACCOUNT_STATE = "clear_create_admin_account_state";
export const CREATE_ADMIN_ACCOUNT = "create_admin_account";
export const CREATE_ADMIN_ACCOUNT_SUCCESS = "create_admin_account_success";
export const CREATE_ADMIN_ACCOUNT_FAILURE = "create_admin_account_failure";
export const CREATE_ADMIN_EMAIL_ERROR = "create_admin_email_error";
export const CREATE_ADMIN_PASSWORD_ERROR = "create_admin_password_error";
export const CREATE_ADMIN_FULL_NAME_ERROR = "create_admin_full_name_error";
export const CREATE_ADMIN_PHOTO_ERROR = "create_admin_photo_error";
export const CREATE_ADMIN_ROLES_ERROR = "create_admin_roles_error";
export const CREATE_ADMIN_ERROR = "create_admin_error";
export const CLOSE_CREATE_ADMIN_SUCCESS_MODAL = "close_create_admin_success_modal";
export const CLEAR_CREATE_ADMIN_ACCOUNT_ERRORS = "clear_create_admin_account_errors";

//CustomerAccounts Types
export const GET_CUSTOMER_ACCOUNTS = "get_customer_accounts";
export const GET_CUSTOMER_ACCOUNTS_COMPLETE = "get_customer_accounts_complete";
export const CLEAR_CUSTOMER_ACCOUNTS_STATE = "clear_customer_accounts_state";
export const SEARCH_CUSTOMER_ACCOUNTS_COMPLETE = "search_customer_accounts_complete";
export const SEARCH_CUSTOMER_ACCOUNTS_LIMIT_CHANGED = "search_customer_accounts_limit_changed";

//ViewCustomerAccount Types
export const GET_CUSTOMER_DATA = "get_customer_data";
export const GET_CUSTOMER_DATA_COMPLETE = "get_customer_data_complete";
export const CLEAR_VIEW_CUSTOMER_ACCOUNT_STATE = "clear_view_customer_account_state";

//StoreAccounts Types
export const INITIALIZE_STORE_ACCOUNTS_PAGE = "initialize_store_accounts_page";
export const INITIALIZE_STORE_ACCOUNTS_PAGE_COMPLETE = "initialize_store_accounts_page_complete";
export const CLEAR_STORE_ACCOUNTS_STATE = "clear_store_accounts_state";
export const SEARCH_STORE_ACCOUNTS_COMPLETE = "search_store_accounts_complete";
export const SEARCH_STORE_ACCOUNTS_LIMIT_CHANGED = "search_store_accounts_limit_changed";
export const STORE_ACCOUNTS_CHANGED = "store_accounts_changed";

//ViewStoreAccount Types
export const GET_STORE_DATA = "get_store_data";
export const GET_STORE_DATA_COMPLETE = "get_store_data_complete";
export const CLEAR_VIEW_STORE_ACCOUNT_STATE = "clear_view_store_account_state";
export const STORE_ACCOUNT_REVIEWERS_CHANGED = "store_account_reviewers_changed";
export const STORE_ACCOUNT_STATUS_CHANGED = "store_account_status_changed";
export const STORE_ACCOUNT_REVIEW_STATUS_CHANGED = "store_account_review_status_changed";
export const STORE_ACCOUNT_VERIFIED_BY_CHANGED = "store_account_verified_by_changed";
export const STORE_ACCOUNT_ADMINS_DECLINED_CHANGED = "store_account_admins_declined_changed";
export const STORE_ACCOUNT_UNVERIFIED_REASONS_CHANGED = "store_account_unverified_reasons_changed";

//DriverAccounts Types
export const INITIALIZE_DRIVER_ACCOUNTS_PAGE = "initialize_driver_accounts_page";
export const INITIALIZE_DRIVER_ACCOUNTS_PAGE_COMPLETE = "initialize_driver_accounts_page_complete";
export const CLEAR_DRIVER_ACCOUNTS_STATE = "clear_driver_accounts_state";
export const SEARCH_DRIVER_ACCOUNTS_COMPLETE = "search_driver_accounts_complete";
export const SEARCH_DRIVER_ACCOUNTS_LIMIT_CHANGED = "search_driver_accounts_limit_changed";
export const DRIVER_ACCOUNTS_CHANGED = "driver_accounts_changed";

//ViewDriverAccount Types
export const GET_DRIVER_DATA = "get_driver_data";
export const GET_DRIVER_DATA_COMPLETE = "get_driver_data_complete";
export const CLEAR_VIEW_DRIVER_ACCOUNT_STATE = "clear_view_driver_account_state";
export const DRIVER_ACCOUNT_REVIEWERS_CHANGED = "driver_account_reviewers_changed";
export const DRIVER_ACCOUNT_ADMINS_DECLINED_CHANGED = "driver_account_admins_declined_changed";
export const DRIVER_ACCOUNT_REVIEW_STATUS_CHANGED = "driver_account_review_status_changed";
export const DRIVER_ACCOUNT_UNVERIFIED_REASONS_CHANGED = "driver_account_unverified_reasons_changed";
export const DRIVER_ACCOUNT_DRIVER_VERIFIED_CHANGED = "driver_account_driver_verified_changed";
export const DRIVER_ACCOUNT_VERIFIED_BY_CHANGED = "driver_account_verified_by_changed";

//UserProfiles Types
export const GET_USER_PROFILES = "get_user_profiles";
export const GET_USER_PROFILES_COMPLETE = "get_user_profiles_complete";
export const CLEAR_USER_PROFILES_STATE = "clear_user_profiles_state";
export const SEARCH_USER_PROFILES_COMPLETE = "search_user_profiles_complete";
export const SEARCH_USER_PROFILES_LIMIT_CHANGED = "search_user_profiles_limit_changed";

//ViewUserProfile Types
export const GET_USER_PROFILE = "get_user_profile";
export const GET_USER_PROFILE_COMPLETE = "get_user_profile_complete";
export const CLEAR_VIEW_USER_PROFILE_STATE = "clear_view_user_profile_state";
export const PROFILE_STATUS_CHANGED = "profile_status_changed";
export const PROFILE_BLOCKED_BY_CHANGED = "profile_blocked_by_changed";
export const PROFILE_BLOCKED_REASONS_CHANGED = "profile_blocked_reasons_changed";
export const STORY_POSTS_CHANGED = "story_posts_changed";
export const PROFILE_POSTS_CHANGED = "profile_posts_changed";
export const ADMINS_REQUESTED_BLOCK_CHANGED = "admins_requested_block_changed";
export const BLOCK_REQUESTS_CHANGED = "block_requests_changed";

//PostCases Types
export const GET_POST_CASES = "get_post_cases";
export const GET_POST_CASES_COMPLETE = "get_post_cases_complete";
export const CLEAR_POST_CASES_STATE = "clear_post_cases_state";
export const SEARCH_POST_CASES_COMPLETE = "search_post_cases_complete";
export const SEARCH_POST_CASES_LIMIT_CHANGED = "search_post_cases_limit_changed";
export const POST_CASES_CHANGED = "post_cases_changed";

//ViewPostCase Types
export const GET_POST_CASE = "get_post_case";
export const GET_POST_CASE_COMPLETE = "get_post_case_complete";
export const CLEAR_VIEW_POST_CASE_STATE = "clear_view_post_case_state";
export const POST_CASE_REVIEWERS_CHANGED = "post_case_reviewers_changed";
export const POST_CASE_DELETED_BY_CHANGED = "post_case_deleted_by_changed";
export const POST_CASE_REVIEW_STATUS_CHANGED = "post_case_review_status_changed";
export const POST_CASE_ADMINS_REVIEWED_CHANGED = "post_case_admins_reviewed_changed";
export const POST_CASE_REVIEWED_BY_CHANGED = "post_case_reviewed_by_changed";
export const POST_CASE_POST_CHANGED = "post_case_post_changed";
export const POST_CASE_POST_COMPLAINTS_CHANGED = "post_case_post_complaints_changed";

//UnconfirmedOrders Types
export const INITIALIZE_UNCONFIRMED_ORDERS_PAGE = "initialize_unconfirmed_orders_page";
export const INITIALIZE_UNCONFIRMED_ORDERS_PAGE_COMPLETE = "initialize_unconfirmed_orders_page_complete";
export const CLEAR_UNCONFIRMED_ORDERS_STATE = "clear_unconfirmed_orders_state";
export const SEARCH_UNCONFIRMED_ORDERS_COMPLETE = "search_unconfirmed_orders_complete";
export const UNCONFIRMED_ORDERS_CHANGED = "unconfirmed_orders_changed";

//ViewUnconfirmedOrder Types
export const GET_UNCONFIRMED_ORDER = "get_unconfirmed_order";
export const GET_UNCONFIRMED_ORDER_COMPLETE = "get_unconfirmed_order_complete";
export const CLEAR_VIEW_UNCONFIRMED_ORDER_STATE = "clear_view_unconfirmed_order_state";
export const UNCONFIRMED_ORDER_REVIEWERS_CHANGED = "unconfirmed_order_reviewers_changed";
export const UNCONFIRMED_ORDER_RECEIPT_URL_CHANGED = "unconfirmed_order_receipt_url_changed";
export const OPEN_UNCONFIRMED_ORDER_LOADING_MODAL = "open_unconfirmed_order_loading_modal";
export const CLOSE_UNCONFIRMED_ORDER_LOADING_MODAL = "close_unconfirmed_order_loading_modal";

// UnsuccessfulOrders Types
export const INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE = "initialize_unsuccessful_orders_page";
export const INITIALIZE_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE = "initialize_unsuccessful_orders_page_complete";
export const CLEAR_UNSUCCESSFUL_ORDERS_STATE = "clear_unsuccessful_orders_state";
export const SEARCH_DRIVERS_UNSUCCESSFUL_ORDERS_COMPLETE = "search_drivers_unsuccessful_orders_complete";
export const DRIVERS_UNSUCCESSFUL_ORDERS_CHANGED = "drivers_unsuccessful_orders_changed";

//DriverUnsuccessfulOrders Types
export const INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE = "initialize_driver_unsuccessful_orders_page";
export const INITIALIZE_DRIVER_UNSUCCESSFUL_ORDERS_PAGE_COMPLETE = "initialize_driver_unsuccessful_orders_page_complete";
export const CLEAR_DRIVER_UNSUCCESSFUL_ORDERS_STATE = "clear_driver_unsuccessful_orders_state";
export const DRIVER_UNSUCCESSFUL_ORDERS_RESOLVERS_CHANGED = "driver_unsuccessful_orders_resolvers_changed";
export const DRIVER_UNSUCCESSFUL_ORDERS_UPDATED = "driver_unsuccessful_orders_updated";