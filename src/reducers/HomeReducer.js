import {
    INITIALIZE_HOME_PAGE, INITIALIZE_HOME_PAGE_COMPLETE,
    LOGOUT_SUCCESS
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    profile_photo: '',
    name: '',
    email: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_HOME_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                profile_photo: action.payload.profile_photo,
                name: action.payload.name,
                email: action.payload.email
            };
        case INITIALIZE_HOME_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case LOGOUT_SUCCESS:
            return {
                ...INITIAL_STATE
            };
        default:
            return state;
    }
}