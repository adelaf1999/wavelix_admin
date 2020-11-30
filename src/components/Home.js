import React, { Component } from 'react';
import { connect } from 'react-redux';


class Home extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = {
          history
        };

    }

    componentDidMount(){

        const { logged_in } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }

    }


    render(){

        return(

            <div>

                <p style={{textAlign:'center', fontSize: 22}}>Hello from Home.js</p>

            </div>

        );

    }


}


const mapStateToProps = (state) => {

    const {
        access_token,
        client,
        uid,
        logged_in
    } = state.login;


    return {
        access_token,
        client,
        uid,
        logged_in
    };


};


export default connect(mapStateToProps)(Home)