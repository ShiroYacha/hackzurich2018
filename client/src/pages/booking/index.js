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
    let newSteps = [{
      description: "",
      status: "finish",
      title: "Availability"
    },{
      description: "Booking confirmed",
      status: "process",
      title: "Booking"
    }, ...this.state.steps.slice(2, 4)];

    setTimeout(() => {
      this.setState({steps: newSteps})
    }, 2000)

    this.setState({ranges: [ranges.selection]})
    this.setState({selectedStep:1})
  }

  iconBasic () {
    return (<Icon type="check-circle" theme="filled" />)
  }

  iconCompleted () {
    return (<Icon type="check-circle" theme="filled" />)
  }

  renderSteps () {
    return this.state.steps.map((s, i) => {
      return <Step title={s.title} icon={this.state.selected > i ? this.iconCompleted() : null} status={s.status}
                   description={s.description} />
    })
  }

  render () {
    return (
      <div>

        <DateRangePicker
          ranges={this.state.ranges}
          onChange={this.handleSelect}
        />

        <Steps direction="vertical" current={this.state.selectedStep}>
          {this.renderSteps()}
        </Steps>
      </div>
    )
  }
}

export default Booking;
