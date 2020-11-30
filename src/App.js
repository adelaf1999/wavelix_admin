import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Routes  from "./Routes";
import reducers from "./reducers";
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from "redux-thunk";
import { Provider } from 'react-redux';
import { persistStore} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';


export default function App() {

    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    const persistor = persistStore(store);


    return(

        <Provider store={store}>


            <PersistGate loading={null} persistor={persistor}>

                <Routes/>

            </PersistGate>


        </Provider>

    );


}
