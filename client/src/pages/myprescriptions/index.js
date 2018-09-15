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
          <Collapse bordered={false} defaultActiveKey={['']}>
            <Panel header="Omeoprazol 500mg" key="1">
              <div>
                <h3>Dosage</h3>
              </div>
              2 times per day, 1 pill at breakfast, 1 pill after dinner.
              <h3>Targets</h3>
              burning stomach, etc
              <h3>Side-effects</h3>
              Nausea, vomiting, headache
            </Panel>
            <Panel header="NeoCitran 20mg" key="2">

            </Panel>
            <Panel header="Frutizolvin 200mg" key="3">

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
