import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import auth from 'firebase/auth';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Ionicon from 'react-ionicons'
import SendIcon from '@material-ui/icons/Send';
import CallIcon from '@material-ui/icons/Call';
import SearchBar from '../landpage/searchbar';
import Chip from '@material-ui/core/Chip';
// import { Card } from 'antd';
import 'antd/dist/antd.css'

import blue from '@material-ui/core/colors/blue';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

const styles = theme => ({
    card: {
        width: 200,
    },
    bigCard: {
        width: 250,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginLeft: 0,
        marginBottom: 5,
        fontSize: 14,
    },
    heading: {
        fontSize: 25,
        marginLeft: 0,
        marginBottom: 5,
        marginTop: 5
    },
    image: {
        height: 100,
        marginLeft: 0,
        marginBottom: 5,
        marginTop: 10
    },
    categoryTitle: {
        fontSize: 18,
        marginLeft: '5px',
        marginBottom: '0px',
        marginTop: 'auto',
        color: 'black'
    },
    pos: {
        marginBottom: 12,
    },
    button: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    }
});

class SearchResults extends Component {

    constructor() {
        super();
        this.state = {
            issues: [],
            drugs: [],
            doctors: []
        };
    }

    componentDidMount() {
        const db = firebase.firestore();
        // listen to issues
        this.unsubscribeIssuesListener = db.collection('issues').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const issues = data.results;
                this.setState({ issues });
            }
        });
        // listen to drugs
        this.unsubscribeDrugsListener = db.collection('drugs').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const drugs = data.results;
                this.setState({ drugs });
            }
        });
        // listen to doctors
        this.unsubscribeDoctorsListener = db.collection('doctors').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const doctors = data.results;
                this.setState({ doctors });
            }
        });
        // listen to symptoms
        this.unsubscribeSymptomsListener = db.collection('symptoms').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const symptoms = data.results;
                this.setState({ symptoms });
            }
        });
    }

    bookAppointment = (did) => {
        this.props.history.push(`/booking?did=${did}`);
    }

    componentWillUnmount() {
        this.unsubscribeIssuesListener();
        this.unsubscribeDrugsListener();
        this.unsubscribeDoctorsListener();
    }

    render() {
        const { classes, location } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{ padding: '20px' }}>
                    <SearchBar style={{ margin: '20px' }} noSuggestions />
                    <div style={{ margin: 'auto', width: '90vw', height: '80vh', marginTop: '20px' }}>
                        <div style={{ display: 'flex' }}>
                            <div
                                style={{ width: '30%', margin: '0px', padding: '0px' }}>
                                <div style={{ display: 'flex', marginBottom: '25px' }}>
                                    <Ionicon icon="md-thermometer" fontSize="30px" />
                                    <Typography className={classes.categoryTitle} color="textSecondary">
                                        Issues
                                </Typography>
                                </div>
                                <StackGrid
                                    columnWidth={200}
                                    gutterWidth={10}
                                    gutterHeight={10}
                                >
                                    {
                                        this.state.issues && this.state.issues.map(i => {
                                            return (<Card className={classes.card} key={i.id}>
                                                <CardContent>
                                                    <Chip label={i.symptom}/>
                                                    <Typography variant="headline" className={classes.heading}>
                                                        {i.name}
                                                    </Typography>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        accuracy: {i.accuracy}
                                                    </Typography>
                                                    <Typography component="p">
                                                        {i.icdname}
                                                        <br />
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small">Learn More</Button>
                                                </CardActions>
                                            </Card>);
                                        })
                                    }
                                </StackGrid>
                            </div>
                            <div
                                style={{ width: '40%' }}>
                                <div style={{ display: 'flex', marginBottom: '25px' }}>
                                    <Ionicon icon="md-pint" fontSize="30px" />
                                    <Typography className={classes.categoryTitle} color="textSecondary">
                                        Drugs
                </Typography>
                                </div>
                                <StackGrid
                                    columnWidth={200}
                                    gutterWidth={10}
                                    gutterHeight={10}
                                >
                                    {
                                        this.state.drugs && this.state.drugs.map(d => {
                                            return (<Card className={classes.card} key={d.id}>
                                                <CardContent>
                                                    <Typography className={classes.title} color="textSecondary">
                                                        {d.authHolder}
                                                    </Typography>
                                                    <Chip label={d.issue}/>
                                                    {d.photo ? (<CardMedia className={classes.image} image={d.photo} />) : (<div></div>)}
                                                    <Typography variant="headline" className={classes.heading}>
                                                        {d.name}
                                                    </Typography>
                                                    <Typography component="p">
                                                        {d.description}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small">Learn More</Button>
                                                </CardActions>
                                            </Card>);
                                        })
                                    }
                                </StackGrid>
                            </div>
                            <div
                                style={{ width: '30%' }}>
                                <div style={{ display: 'flex', marginBottom: '25px' }}>
                                    <Ionicon icon="md-medkit" fontSize="30px" />
                                    <Typography className={classes.categoryTitle} color="textSecondary">
                                        Doctors
                                </Typography>
                                </div>
                                <StackGrid
                                    columnWidth={200}
                                    gutterWidth={10}
                                    gutterHeight={10}
                                >
                                    {
                                        this.state.doctors && this.state.doctors.map(d => {
                                            switch (d.group) {
                                                case 'FAMILY_DOCTOR':
                                                    return (<Card key={d.id} className={classes.card}>
                                                        <CardContent>
                                                            <Typography className={classes.title} color="textSecondary">
                                                                {d.category}
                                                            </Typography>
                                                            <Chip label={d.spec}/>
                                                            <Typography variant="headline" className={classes.heading}>
                                                                <span style={{ fontSize: '15px' }}>{d.title}</span><br /><span>{d.firstName + " " + d.name}</span>
                                                            </Typography>
                                                            <Typography className={classes.pos} color="textSecondary">
                                                                <span>{d.phone}<p>{d.email}</p></span>
                                                            </Typography>
                                                            <Typography component="p">
                                                                <div style={{ display: 'flex' }}>
                                                                    <Ionicon icon="md-ribbon" fontSize="25px" color='rgb(61, 145, 255)' />
                                                                    <span style={{ marginTop: '2.5px', color: 'rgb(61, 145, 255)' }}>
                                                                        Family doctor
                                                                </span>
                                                                </div>
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.bookAppointment(d.id)}>
                                                                Book
                                                            <SendIcon className={classes.rightIcon}></SendIcon>
                                                            </Button>
                                                        </CardActions>
                                                    </Card>);
                                                case 'DOCTOR':
                                                    return (<Card className={classes.card}>
                                                        <CardContent>
                                                            <Typography className={classes.title} color="textSecondary">
                                                                {d.category}
                                                            </Typography>
                                                            <Chip label={d.spec}/>
                                                            <Typography variant="headline" className={classes.heading}>
                                                                <span style={{ fontSize: '15px' }}>{d.title}</span><br /><span>{d.firstName + " " + d.name}</span>
                                                            </Typography>
                                                            <Typography className={classes.pos} color="textSecondary">
                                                                <span>{d.phone}<p>{d.email}</p></span>
                                                            </Typography>
                                                            <Typography component="p">

                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button variant="contained" color="secondary" className={classes.button}>
                                                                Call
                                                            <CallIcon className={classes.rightIcon}></CallIcon>
                                                            </Button>
                                                        </CardActions>
                                                    </Card>);
                                            }
                                        })
                                    }
                                </StackGrid>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(withStyles(styles)(SearchResults));
