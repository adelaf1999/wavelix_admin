import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getPostCases,
    clearPostCasesState,
    searchPostCases,
    searchPostCasesLimitChanged
} from "../actions";
import {  Spinner, Form, FormControl, Table, Button} from "react-bootstrap";
import _ from "lodash";

class PostCases extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const selected_review_status = null;

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            history,
            search,
            selected_review_status
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

            const {
                searchPostCases,
                limit,
                access_token,
                client,
                uid,
                searchPostCasesLimitChanged
            } = this.props;

            const {  search, selected_review_status, history } = this.state;

            const new_limit = limit + 50;

            searchPostCasesLimitChanged(new_limit);

            searchPostCases(new_limit, search, selected_review_status, access_token, client, uid, history);


        }
    }

    componentWillUnmount(){

        window.removeEventListener("scroll", this.handleScroll);

        this.props.clearPostCasesState();

    }

    componentDidMount(){

        window.addEventListener("scroll", this.handleScroll);

        const {
            logged_in,
            access_token,
            client,
            uid,
            roles,
            limit,
            getPostCases
        } = this.props;

        const { history } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("profile_manager") ){

            history.push("/home");

        }else{

            getPostCases(limit, access_token, client, uid, history);

        }


    }


    reviewStatusOptions(){

        const { review_status_options } = this.props;

        let options = [];

        options.push({ label: 'Select Option', value: ''});

        _.map(review_status_options, (label, value) => {

            options.push({
                label: _.startCase(label),
                value: value
            });

        });

        return _.map(options, (option, index) => {


            return(

                <option
                    key={index}
                    value={option.value}
                >
                    {option.label}
                </option>

            );

        });

    }

    renderCases(){

        const { post_cases } = this.props;

        return _.map(post_cases, (post_case, index) => {

            return(

                <tr key={index}>

                    <td>
                        {post_case.author_username}
                    </td>

                    <td>
                        {_.startCase(post_case.review_status)}
                    </td>


                    <td>

                        <Button
                            variant="link"
                            onClick={(e) => {

                                e.preventDefault();

                            }}
                        >
                            View
                        </Button>

                    </td>



                </tr>

            );

        });

    }

    renderPostCases(){

        const { post_cases } = this.props;

        if(post_cases.length === 0){

            return(

                <div className="center-container">

                    <p className="no-accounts-notice">No Post Cases Found</p>

                </div>

            );

        }else{

            return(

                <Table striped bordered hover>

                    <thead>

                    <tr>

                        <th>Author Username</th>
                        <th>Review Status</th>
                        <th></th>

                    </tr>

                    </thead>

                    <tbody>

                    {this.renderCases()}


                    </tbody>

                </Table>

            );

        }

    }

    show(){

        const {
            initializing_page,
            access_token,
            client,
            uid,
            limit,
            searchPostCases,
        } = this.props;

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

                    <Form className="searchbar-container" inline>

                        <FormControl
                            type="text"
                            placeholder="Search by author username"
                            className="mr-sm-2"
                            id="searchbar"
                            onChange={(e) => {

                                const new_search = e.target.value;

                                this.setState({search: new_search});

                                const {
                                    selected_review_status
                                } = this.state;

                                searchPostCases(
                                    limit,
                                    new_search,
                                    selected_review_status,
                                    access_token,
                                    client,
                                    uid,
                                    history
                                );

                            }}
                        />

                    </Form>

                    <Form id="post-cases-filters-container">

                        <Form.Group className="post-case-filter-group" >

                            <Form.Label>Review Status</Form.Label>

                            <Form.Control
                                as="select"
                                onChange={(e) => {

                                    const new_selected_review_status = e.target.value;

                                    if(_.isEmpty(new_selected_review_status)){

                                        this.setState({selected_review_status: null});

                                    }else{

                                        this.setState({selected_review_status: new_selected_review_status});
                                    }


                                    const {
                                        search
                                    } = this.state;

                                    searchPostCases(
                                        limit,
                                        search,
                                        new_selected_review_status,
                                        access_token,
                                        client,
                                        uid,
                                        history
                                    );



                                }}
                            >

                                {this.reviewStatusOptions()}

                            </Form.Control>

                        </Form.Group>

                    </Form>

                    {this.renderPostCases()}

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
        limit,
        review_status_options,
        post_cases
    } = state.post_cases;

    return {
        access_token,
        client,
        uid,
        logged_in,
        roles,
        initializing_page,
        limit,
        review_status_options,
        post_cases
    };

};

export default connect(mapStateToProps, {
    getPostCases,
    clearPostCasesState,
    searchPostCases,
    searchPostCasesLimitChanged
})(PostCases);
