import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getAdminAccounts,
    clearAdminAccountsState
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table, Image, Col} from "react-bootstrap";
import { getAdminRoles } from "../helpers";

class AdminAccounts extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = {
            history
        };

    }

    componentWillUnmount(){
        this.props.clearAdminAccountsState();
    }


    componentDidMount(){

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getAdminAccounts
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("employee_manager") ){

            history.push("/home");

        }else{

            getAdminAccounts(access_token, client, uid, history);

        }



    }


    createAccountButton(){

        const { roles  } = this.props;

        if( roles.includes("root_admin") ){

            return(

                <Button
                    variant="outline-primary"
                    id="create-admin-button"
                >
                    Create Account
                </Button>

            );

        }

    }




    editAdminButton(){

        return(

            <Button variant="link">Edit</Button>

        );

    }


    editAdmin(admin_roles){

        const current_admin_roles = this.props.roles;

        if(current_admin_roles.includes("root_admin")){

            if(!admin_roles.includes("root_admin")){

                return(

                    <div>

                        {this.editAdminButton()}

                    </div>

                );

            }

        }else{

            if(!admin_roles.includes("root_admin") && !admin_roles.includes("employee_manager") ){

                return(



                    <div>

                        {this.editAdminButton()}

                    </div>


                );

            }

        }


    }



    renderAccounts(){

        const { admins } = this.props;

        return _.map(admins, (admin, index) => {

            return(

                <tr key={index}>

                    <td >



                        <Image
                            src={admin.profile_photo}
                            thumbnail
                            id="admin-profile-photo"
                        />





                    </td>

                    <td>
                        {admin.full_name}
                    </td>

                    <td>
                        { _.isEmpty(admin.email) ? 'N/A' : admin.email }
                    </td>

                    <td>
                        {getAdminRoles(admin.roles)}
                    </td>


                    <td>
                        { _.isEmpty(admin.current_sign_in_ip) ? 'N/A' : admin.current_sign_in_ip  }
                    </td>

                    <td>
                        { _.isEmpty(admin.last_sign_in_ip) ? 'N/A' : admin.last_sign_in_ip  }
                    </td>

                    <td>
                        {this.editAdmin(admin.roles)}
                    </td>

                </tr>

            );

        });


    }

    show(){

        const { initializing_page } = this.props;

        if(initializing_page){

            return(

                <div className="center-container">

                    <div className="spinner-container">

                        <Spinner animation="border" variant="primary" />

                    </div>

                </div>



            );

        }else{

            return(

                <div className="page-container">

                    <Form id="searchbar-container" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by name or email"
                            className="mr-sm-2"
                            id="searchbar"
                        />

                        {this.createAccountButton()}

                    </Form>




                    <Table striped bordered hover>

                        <thead>

                        <tr>
                            <th>Profile Photo</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Current Sign-In Ip</th>
                            <th>Last Sign-In Ip</th>
                            <th></th>
                        </tr>

                        </thead>

                        <tbody>

                        {this.renderAccounts()}

                        </tbody>

                    </Table>





                </div>

            );

        }

    }

    render(){

        return(

            <Wrapper
                history={this.state.history}
            >

                <div>

                    <TopHeader
                        history={this.state.history}
                    />

                    {this.show()}

                </div>

            </Wrapper>

        );


    }


}

const mapStateToProps = (state) => {

    const {
        access_token,
        client,
        uid,
        logged_in,
        roles
    } = state.login;

    const {
        initializing_page,
        admins,
        available_roles
    } = state.admin_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        admins,
        available_roles
    };
};

export default connect(mapStateToProps, {
    getAdminAccounts,
    clearAdminAccountsState
})(AdminAccounts);
