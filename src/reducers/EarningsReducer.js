import {
    LOGOUT_SUCCESS,
    INITIALIZE_EARNINGS_PAGE,
    INITIALIZE_EARNINGS_PAGE_COMPLETE,
    CLEAR_EARNINGS_PAGE_STATE, GET_YEAR_EARNINGS_COMPLETE
} from "../actions/types";

const INITIAL_STATE = {
    initializing_page: false,
    earnings: [],
    years: [],
    total: null
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_YEAR_EARNINGS_COMPLETE:
            return{
                ...state,
                earnings: action.payload.earnings,
                total: action.payload.total === undefined ? null : action.payload.total
            };
        case INITIALIZE_EARNINGS_PAGE_COMPLETE:
            return{
                ...state,
                initializing_page: false,
                earnings: action.payload.earnings,
                years: action.payload.years,
                total: action.payload.total === undefined ? null : action.payload.total
            };
        case INITIALIZE_EARNINGS_PAGE:
            return{
                ...state,
                initializing_page: true
            };
        case CLEAR_EARNINGS_PAGE_STATE:
            return{
                ...state,
                ...INITIAL_STATE
            };
        case LOGOUT_SUCCESS:
            return {
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};