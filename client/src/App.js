import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';

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
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
