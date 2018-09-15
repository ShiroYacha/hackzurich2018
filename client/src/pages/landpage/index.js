import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, withRouter, Route, Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import './style.css';
import _ from 'lodash';
import debounce from 'debounce';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';
import SearchBar from './searchbar';

class Landpage extends Component {

    render() {

        return (
            <Grid>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6} className="full-height">
                    <SearchBar/>
                </Grid.Column>
                <Grid.Column width={5}></Grid.Column>
                {/*<Grid.Column width={8}>
                    <Segment>
                        <Header>State</Header>
                        <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
                        <Header>Options</Header>
                        <pre style={{ overflowX: 'auto' }}>{JSON.stringify(source, null, 2)}</pre>
                    </Segment>
                </Grid.Column>*/}
            </Grid>
        )
    }
}

export default withRouter(Landpage);
