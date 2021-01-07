import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutAdmin } from "../actions";
import { Navbar, Nav, Button} from "react-bootstrap";


class TopHeader extends Component{

    constructor(props) {

        super(props);

        const history = props.history;

        this.state = { history };


    }


    adminsTab(){

        const { roles } = this.props;

        const { history } = this.state;

        if(roles.includes("root_admin") || roles.includes("employee_manager")){

            return(

                <Nav.Link
                    onClick={() => {
                        history.push("/admin-accounts");
                    }}
                    className="nav-link"
                >
                   Admins
                </Nav.Link>


            );

        }

    }


    profilesTab(){

        const { roles } = this.props;

        const { history } = this.state;


        if(roles.includes("root_admin") || roles.includes("profile_manager")){

            return(

                <Nav.Link
                    onClick={() => {
                        history.push("/profiles");
                    }}
                    className="nav-link"
                >
                    Profiles
                </Nav.Link>


            );

        }

    }

    postCasesTab(){

        const { roles } = this.props;

        const { history } = this.state;

        if(roles.includes("root_admin") || roles.includes("profile_manager")){

            return(

                <Nav.Link
                    onClick={() => {
                        history.push("/post-cases");
                    }}
                    className="nav-link"
                >
                    Post Cases
                </Nav.Link>


            );

        }


    }


    render(){

        const { history } = this.state;


        return(

            <Navbar bg="dark" variant="dark">

                <Navbar.Brand
                    onClick={() => {
                        history.push("/home");
                    }}
                    style={{
                        color: "#1f67ff",
                        fontWeight: 'bold',
                        fontSize: 24
                    }}
                >
                    WAVELIX
                </Navbar.Brand>

                <Nav className="mr-auto">

                    <Nav.Link
                        onClick={() => {
                            history.push("/home");
                        }}
                        className="nav-link"
                    >
                        Home
                    </Nav.Link>

                    {this.adminsTab()}

                    <Nav.Link
                        onClick={() => {
                            history.push("/customer-accounts");
                        }}
                        className="nav-link"
                    >
                        Customers
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => {
                            history.push("/store-accounts");
                        }}
                        className="nav-link"
                    >
                        Stores
                    </Nav.Link>


                    <Nav.Link
                        onClick={() => {
                            history.push("/driver-accounts");
                        }}
                        className="nav-link"
                    >
                        Drivers
                    </Nav.Link>

                    {this.profilesTab()}

                    {this.postCasesTab()}


                </Nav>

                <Nav>

                    <Button
                        variant="danger"
                        onClick={(e) => {

                            e.preventDefault();

                            const { logoutAdmin, access_token, client, uid } = this.props;

                            logoutAdmin(access_token, client, uid, history);

                        }}
                    >
                        Logout
                    </Button>

                </Nav>



            </Navbar>

        );

    }

}

const mapStateToProps = (state) => {

    const {
        access_token,
        client,
        uid,
        roles
    } = state.login;


    return {
        access_token,
        client,
        uid,
        roles
    };


};

export default connect(mapStateToProps, {
    logoutAdmin
})(TopHeader);