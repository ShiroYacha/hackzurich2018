import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Collapse } from 'antd/lib/index'
import Button from '@material-ui/core/Button'
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
const Panel = Collapse.Panel;

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

class MyPrescriptions extends Component {

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{width:'60%',margin:'0 auto'}}>
          <h2>My Prescriptions</h2>
          <div><strong>Prescription ID: </strong>24230523</div>
          <p></p>
          <p></p>
          <Collapse bordered={false} defaultActiveKey={['']}>
            <Panel header="Almotriptan 500mg" key="1">
              <div>
                <h3>Dosage</h3>
              </div>
              2 times per day, 1 pill at breakfast, 1 pill after dinner
              <h3>Targets</h3>
              migraines and related symptoms including sensitivity to light/sound, nausea, and vomiting
              <h3>Side-effects</h3>
              Drowsiness, dizziness, nausea, sensations of tingling/numbness/prickling, or dry mouth
            </Panel>
            <Panel header="NeoCitran 20mg" key="2">
              <div>
                <h3>Dosage</h3>
              </div>
              Max 3 times per day, pills after meals (breakfast, lunch dinner)
              <h3>Targets</h3>
              Fortification of the immune system
              <h3>Side-effects</h3>
              May cause gastrointestinal discomfort, trouble sleeping, and flushing of the skin
            </Panel>
            <Panel header="Minoxidil 200mg" key="3">
              <div>
                <h3>Dosage</h3>
              </div>
              Once per day, after breakfast
              <h3>Targets</h3>
              Minoxidil is an antihypertensive peripheral vasodilator, targets hypertension
              <h3>Side-effects</h3>
              May produce serious adverse effects such as pericardial effusion
            </Panel>
          </Collapse>

          <Button style={{margin: 30, width: '200px'}} variant="contained"
                  color="primary">
            Pickup QR Code
          </Button>
          <Button style={{margin: 30, width: '200px'}} variant="contained"
                  color="primary">
            Request home delivery
          </Button>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default MyPrescriptions;
