import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getAdminAccounts,
    clearAdminAccountsState,
    searchAdmins,
    searchAdminsLimitChanged
} from "../actions";
import _ from "lodash";
import {  Spinner, Form, FormControl, Button, Table, Image} from "react-bootstrap";
import { getAdminRoles } from "../helpers";

class AdminAccounts extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        const selected_role = null;

        const search = "";

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            history,
            selected_role,
            search
        };

    }

    handleScroll() {

        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

        const body = document.body;

        const html = document.documentElement;

        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);

        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight) {

            console.log("bottom reached");

            const { limit, searchAdminsLimitChanged, access_token, client, uid, searchAdmins } = this.props;

            const { search, selected_role, history } = this.state;

            const new_limit = limit + 30;

            searchAdminsLimitChanged(new_limit);

            searchAdmins(new_limit, search, selected_role, access_token, client, uid, history);



        }
    }


    componentWillUnmount(){

        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearAdminAccountsState();

    }



    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            getAdminAccounts,
            limit
        } = this.props;

        const { history } = this.state;


        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("employee_manager") ){

            history.push("/home");

        }else{

            getAdminAccounts(limit, access_token, client, uid, history);

        }



    }


    createAccountButton(){

        const { roles  } = this.props;

        if( roles.includes("root_admin") ){

            return(

                <Button
                    variant="outline-primary"
                    id="create-admin-button"
                    onClick={(e) => {
                        e.preventDefault();
                        this.state.history.push("/create-admin-account");
                    }}
                >
                    Create Account
                </Button>

            );

        }

    }




    editAdminButton(admin_id){

        const history = this.state.history;

        return(

            <Button
                variant="link"
                onClick={() => {
                    history.push(`/view-admin-account/admin_id=${admin_id}`);
                }}
            >
                Edit
            </Button>

        );

    }


    editAdmin(admin){


        const admin_roles = admin.roles;

        const admin_id = admin.id;

        const current_admin_roles = this.props.roles;

        if(current_admin_roles.includes("root_admin")){

            if(!admin_roles.includes("root_admin")){

                return(

                    <div>

                        {this.editAdminButton(admin_id)}

                    </div>

                );

            }

        }else{

            if(!admin_roles.includes("root_admin") && !admin_roles.includes("employee_manager") ){

                return(



                    <div>

                        {this.editAdminButton(admin_id)}

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
                        {this.editAdmin(admin)}
                    </td>

                </tr>

            );

        });


    }


    getAvailableRoles(){

        const {  available_roles } = this.props;

        let roles = [];

        roles.push({ label: 'Select Role', value: ''});

        _.map(available_roles, (role, index) => {

            roles.push({
                label: _.startCase( role.split("_").join(" ") ),
                value: role
            });

        });

        return roles;

    }


    renderAdmins(){

        const {  admins } = this.props;

        if(admins.length === 0){

            return(


                <div className="center-container">

                    <p className="no-accounts-notice">No Accounts Found</p>

                </div>

            );

        }else{

            return(

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

            );

        }

    }




    show(){

        const { initializing_page,   searchAdmins, access_token, client, uid, limit} = this.props;

        const { history } = this.state;

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
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                searchAdmins(limit, new_search, this.state.selected_role, access_token, client, uid, history);



                            }}
                        />

                        {this.createAccountButton()}

                    </Form>

                    <Form id="role-selector-container">

                        <Form.Group id="role-selector-group" controlId="roleSelector">

                            <Form.Label>Role</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_role = e.target.value;

                                    if(_.isEmpty(new_selected_role)){

                                        this.setState({selected_role: null});

                                    }else{

                                        this.setState({selected_role: new_selected_role});
                                    }


                                    searchAdmins(limit, this.state.search, new_selected_role, access_token, client, uid, history);

                                }}
                            >

                                {
                                    this.getAvailableRoles().map((role, index) => (
                                    <option
                                        key={index}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </option>
                                    ))
                                }

                            </Form.Control>

                        </Form.Group>


                    </Form>


                    {this.renderAdmins()}





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
        available_roles,
        limit
    } = state.admin_accounts;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        admins,
        available_roles,
        limit
    };
};

export default connect(mapStateToProps, {
    getAdminAccounts,
    clearAdminAccountsState,
    searchAdmins,
    searchAdminsLimitChanged
})(AdminAccounts);
