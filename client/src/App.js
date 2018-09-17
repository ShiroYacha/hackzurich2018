import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Booking from './pages/booking/index';
import Landpage from './pages/landpage/index';
import MyPrescriptions from './pages/myprescriptions/index';
import SearchResults from './pages/searchresults/index';

class App extends Component {

  constructor() {
    super();
    var config = {
      apiKey: "AIzaSyDHTWsvvPsiUlJWmDPc-etu0OgIlwEtunY",
      authDomain: "hackzurich2018.firebaseapp.com",
      databaseURL: "https://hackzurich2018.firebaseio.com",
      projectId: "hackzurich2018",
      storageBucket: "hackzurich2018.appspot.com",
      messagingSenderId: "840979151298"
    };
    firebase.initializeApp(config);
    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/landpage" component={Landpage} />
          <Route path="/searchresults" component={SearchResults} />
          <Route path="/booking" component={Booking} />
          <Route path="/myprescriptions" component={MyPrescriptions} />
        </div>
      </Router>
    );
  }
}

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);


export default App;
