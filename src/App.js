import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes  from "./Routes";

class App extends Component{

    constructor(props){

        super(props);

    }

    render(){

      return(

          <Routes/>

      );

    }

}

export default App;