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
            <Grid style={{ backgroundImage: 'url("http://hdqwalls.com/wallpapers/switzerland-landscape-4k-hd.jpg")', backgroundSize: 'cover' }}>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6} className="full-height">
                    <div style={{position:'absolute', top:'40%', color:'white', width:'40vw'}}>
                        <SearchBar/>
                        <br></br>
                        <span style={{paddingLeft: '10px'}}> Bring digital healthcare to your finger tips ... </span>
                    </div>
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
