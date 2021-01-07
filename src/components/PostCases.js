import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopHeader from "./TopHeader";
import Wrapper from "./Wrapper";
import {
    getPostCases,
    clearPostCasesState,
    searchPostCases,
    searchPostCasesLimitChanged,
    postCasesChanged
} from "../actions";
import {  Spinner, Form, FormControl, Table, Button} from "react-bootstrap";
import _ from "lodash";
import actionCable from "actioncable";
import { ACTION_CABLE_ROUTE } from "../actions/types";

class PostCases extends Component{

    constructor(props){

        super(props);

        const history = props.history;

        const search = "";

        const selected_review_status = null;

        this.handleScroll = this.handleScroll.bind(this);

        const cable = actionCable.createConsumer(ACTION_CABLE_ROUTE);

        const post_cases_channel_subscription = null;

        this.state = {
            history,
            search,
            selected_review_status,
            cable,
            post_cases_channel_subscription
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

        const cable = this.state.cable;

        const post_cases_channel_subscription = this.state.post_cases_channel_subscription;

        if(post_cases_channel_subscription !== null){

            cable.subscriptions.remove(post_cases_channel_subscription);

        }

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
            getPostCases,
            postCasesChanged
        } = this.props;

        const { history, cable } = this.state;

        if(!logged_in){

            history.push("/");

        }else if( !roles.includes("root_admin") && !roles.includes("profile_manager") ){

            history.push("/home");

        }else{

            getPostCases(limit, access_token, client, uid, history);

            let post_cases_channel_subscription = this.state.post_cases_channel_subscription;

            if(post_cases_channel_subscription === null){

                post_cases_channel_subscription = cable.subscriptions.create(
                    {
                        channel: 'PostCasesChannel',
                        access_token: access_token,
                        client: client,
                        uid: uid
                    },
                    {
                        connected: () => {

                            console.log('PostCasesChannel Connected!');

                        },
                        received: (data) => {

                            console.log("PostCasesChannel Received!");

                            console.log(data);

                            if(data.new_post_case){

                                const { searchPostCases } = this.props;

                                const { search, selected_review_status } = this.state;

                                searchPostCases(
                                   limit,
                                   search,
                                   selected_review_status,
                                   access_token,
                                   client,
                                   uid,
                                   history
                                );

                            }


                            if(data.post_case_item !== undefined){

                                const post_case_item = data.post_case_item;

                                let post_cases = _.cloneDeep(this.props.post_cases);

                                const post_case_index = _.findIndex(post_cases, { id: post_case_item.id });

                                if(post_case_index !== -1){

                                    post_cases[post_case_index] = post_case_item;

                                    postCasesChanged(post_cases);

                                }

                            }


                            if(data.post_case_deleted){

                                const post_case_id = data.id;

                                let post_cases = _.cloneDeep(this.props.post_cases);

                                _.remove(post_cases, function(post_case) {
                                    return post_case.id === post_case_id;
                                });


                                postCasesChanged(post_cases);


                            }


                        }
                    }
                );

                this.setState({post_cases_channel_subscription: post_cases_channel_subscription});

            }

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

        const { history } = this.state;

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

                                history.push(`/post-cases/post_case_id=${post_case.id}`);

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
    searchPostCasesLimitChanged,
    postCasesChanged
})(PostCases);
