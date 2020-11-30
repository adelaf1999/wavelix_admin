import {combineReducers} from 'redux';
import LoginReducer from "./LoginReducer";
import storage from 'redux-persist/lib/storage';
import { LOGOUT_SUCCESS } from "../actions/types";

const appReducer = combineReducers({
    login: LoginReducer
});


const rootReducer = ( state, action ) => {

    if ( action.type === LOGOUT_SUCCESS ) {

        storage.removeItem('login:access_token').then(() => console.log("access_token removed"));

        storage.removeItem('login:client').then(() => console.log("client removed"));

        storage.removeItem('login:uid').then(() => console.log("uid removed"));

        storage.removeItem('login:logged_in').then(() => console.log("logged_in removed"));

    }

    return appReducer(state, action);

};


export default rootReducer;