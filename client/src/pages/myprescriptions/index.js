import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class MyPrescriptions extends Component {

  render() {
    return (
        <div>
            <h2>My prescriptions</h2>
        </div>
    );
  }
}

export default MyPrescriptions;
