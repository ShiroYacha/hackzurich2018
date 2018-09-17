import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Steps, Icon, Collapse } from 'antd';
import 'antd/dist/antd.css'
import Button from '@material-ui/core/Button'

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

const Step = Steps.Step;

class Booking extends Component {

    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this)

        this.state = {
            ranges: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
                bookingStatusLoaded: false,
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
                }
            ]
        }

        const db = firebase.firestore();

        db.collection('booking').doc('demo').set({ status: false });

        db.collection('booking').doc('demo').onSnapshot(docSnapshot => {
            const data = docSnapshot.data();
            console.log(data.status);
            if (!this.state.bookingStatusLoaded) this.setState({ bookingStatusLoaded: true });
            else this.step2();
        })

    }

    handleSelect(ranges) {
        this.setState({ ranges: [ranges.selection] })
    }

    step1() {
        let newSteps = [{
            description: "",
            status: "finish",
            title: "Availability"
        }, {
            description: "Awaiting booking confirmation",
            status: "process",
            title: "Booking"
        }, ...this.state.steps.slice(2, 3)];
        this.setState({ steps: newSteps })
        this.setState({ selectedStep: 1 })

        //this works, don't spam me too many emails
        this.sendEmail()

        //if the email is active this below should be deleted
        /*
      setTimeout(() => {
        this.step2()
      }, 3000)
  */
    }

    step2() {
        let newSteps = [...this.state.steps.slice(0, 1), {
            description: "",
            status: "finish",
            title: "Booking"
        },
        {
            description: "Appointment set, waiting",
            status: "process",
            title: "Appointment"
        }, ...this.state.steps.slice(3, 3)];
        this.setState({ steps: newSteps })
        this.setState({ selectedStep: 2 })

    }



    iconCompleted() {
        return (<Icon type="check-circle" theme="filled" />)
    }

    renderSteps() {
        return this.state.steps.map((s, i) => {
            return <Step key={s.title} title={s.title} icon={this.state.selected > i ? this.iconCompleted() : null}
                status={s.status}
                description={s.description} />
        })
    }

    renderCalendar() {
        return this.state.selectedStep === 0 && (<div>
            <h2>Please, select your availability</h2>
            <DateRangePicker
                ranges={this.state.ranges}
                onChange={this.handleSelect}
            />
            {this.state.ranges[0].startDate < this.state.ranges[0].endDate &&
                <Button style={{ margin: 100, width: '40%' }} onClick={() => this.step1()} variant="contained"
                    color="primary">
                    Confirm availability
      </Button>}
        </div>)
    }

    renderPages() {
        switch (this.state.selectedStep) {
            case 0:
                return this.renderCalendar()
            case 1:
                return (<h2>The doctor has been contacted. Waiting for an answer..</h2>)
            case 2:
                return (<div><h2>Appointment has been set!</h2>
                    <img src={require('../../assets/booked.png')} />
                </div>)
            case 3:
                return this.renderPrescription()
        }
    }


    sendEmail() {
        let msg = `Dear Dr. Meyer<br><br>

    Mr. Min has requested an appointment with you for the next week,<br><br>
    Based on your availability you have a free slot on Monday 17-09-2018 at 10:00 AM.<br><br>
    
    Would you like to accept the appointment and add it to your calendar?<br><br>
    
    
    <a href="https://us-central1-hackzurich2018.cloudfunctions.net/accept"> &nbsp; Yes &nbsp; </a> | <a href="https://us-central1-hackzurich2018.cloudfunctions.net/decline"> &nbsp;No&nbsp; </a>
    `

        fetch('https://nasachallenge.herokuapp.com/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: "tuncel.manil@gmail.com",
                message: msg,
                subject: "Appointment Requested"
            })
        }).then(response => {
            console.log(response)
        })
    }

    handleNavigation = (key) => {
        if(key.key=="1"){
            this.props.history.push('/landpage');
        }
        else{
            this.props.history.push('/myprescriptions');
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Header>
                        {/* <div className="logo" /> */}
                        <Menu
                            theme="light"
                            mode="horizontal"
                            style={{ lineHeight: '64px' }}
                            onSelect={this.handleNavigation}
                        >
                            <Menu.Item key="1">Search</Menu.Item>
                            <Menu.Item key="2">My prescriptions</Menu.Item>
                        </Menu>
                    </Header>
                    
                    <div className="sideBarSteps">
                        <Steps direction="vertical" current={this.state.selectedStep}>
                            {this.renderSteps()}
                        </Steps>
                    </div>

                    <div className="centralBody">
                        {this.renderPages()}
                    </div>

                </div>
            </MuiThemeProvider>
        )
    }
}

export default Booking;
