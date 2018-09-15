import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Steps, Icon } from 'antd';
import 'antd/dist/antd.css'
import Button from '@material-ui/core/Button'

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const Step = Steps.Step;

class Booking extends Component {

  constructor (props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this)

    this.state = {
      ranges: [{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }],
      selectedStep: 0,

      steps: [
        {
          description: "Choose your availability",
          status: "process",
          title: "Availability"
        },
        {
          descriptions: "",
          status: "wait",
          title: "Booking"
        },
        {
          descriptions: "",
          status: "wait",
          title: "Appointment"
        },
        {
          descriptions: "",
          status: "wait",
          title: "Prescription"
        }
      ]
    }

  }

  handleSelect (ranges) {
    this.setState({ranges: [ranges.selection]})
  }

  step1 () {
    let newSteps = [{
      description: "",
      status: "finish",
      title: "Availability"
    }, {
      description: "awaiting booking confirmation",
      status: "process",
      title: "Booking"
    }, ...this.state.steps.slice(2, 4)];
    this.setState({steps: newSteps})
    this.setState({selectedStep: 1})
  }

  step1half () {
    let newSteps = [{
      description: "",
      status: "finish",
      title: "Availability"
    }, {
      description: "Booking confirmed",
      status: "process",
      title: "Booking"
    }, ...this.state.steps.slice(2, 4)];
    this.setState({steps: newSteps})
    this.setState({selectedStep: 1})
  }

  step2 () {
    let newSteps = [...this.state.steps.slice(0, 1), {
      description: "",
      status: "finish",
      title: "Booking"
    },
      {
        description: "Appointment set, waiting",
        status: "process",
        title: "Appointment"
      }, ...this.state.steps.slice(3, 4)];
    this.setState({steps: newSteps})
    this.setState({selectedStep: 2})
  }

  step3 () {
    let newSteps = [...this.state.steps.slice(0, 2), {
      description: "",
      status: "finish",
      title: "Appointment"
    },
      {
        description: "Please, get your prescription",
        status: "process",
        title: "Prescription"
      }];
    this.setState({steps: newSteps})
    this.setState({selectedStep: 3})
  }

  iconCompleted () {
    return (<Icon type="check-circle" theme="filled" />)
  }

  renderSteps () {
    return this.state.steps.map((s, i) => {
      return <Step key={s.title} title={s.title} icon={this.state.selected > i ? this.iconCompleted() : null}
                   status={s.status}
                   description={s.description} />
    })
  }

  renderCalendar () {
    return this.state.selectedStep === 0 && (<div>
      <h2>Please, select your availability</h2>
      <DateRangePicker
        ranges={this.state.ranges}
        onChange={this.handleSelect}
      />
      {this.state.ranges[0].startDate<this.state.ranges[0].endDate && <Button style={{margin: 100, width:'40%'}} onClick={() => this.step1()} variant="contained"
                                                                        color="primary">
        Confirm availability
      </Button>}
    </div>)
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
      <div>

        <div class="sideBarSteps">
          <Steps direction="vertical" current={this.state.selectedStep}>
            {this.renderSteps()}
          </Steps>
        </div>

        <div class="centralBody">
          {this.renderCalendar()}
        </div>

        <button onClick={() => this.step1()}>STEP 1</button>
        <button onClick={() => this.step1half()}>STEP 1half</button>
        <button onClick={() => this.step2()}>STEP 2</button>
        <button onClick={() => this.step3()}>STEP 3</button>

      </div>
      </MuiThemeProvider>
    )
  }
}

export default Booking;
