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
        marginBottom: 5,
        fontSize: 14,
    },
    heading: {
        fontSize: 25,
        marginBottom: 5,
        marginTop: 5
    },
    image: {
        height: 100,
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
        const { classes } = this.props;
        return (
            <div>
                <div style={{ margin: 'auto', width: '90vw', height: '80vh' }}>
                    <h2>Search results</h2>
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
                                                <Typography className={classes.title} color="textSecondary">
                                                    {i.symptom}
                                                </Typography>
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
                                columnWidth={250}
                                gutterWidth={10}
                                gutterHeight={10}
                            >
                                {
                                    this.state.drugs && this.state.drugs.map(d => {
                                        return (<Card className={classes.bigCard} key={d.id}>
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary">
                                                    {d.prescriptionOnly ? (<div style={{ display: 'flex' }}>
                                                        <Ionicon icon="ios-paper" fontSize="14px" color="#838383" />
                                                        <div style={{ marginLeft: '5px', marginTop: '-3px' }}>prescription drug</div>
                                                    </div>) : 'non-prescription drug'}
                                                </Typography>
                                                <CardMedia className={classes.image} image={d.photo} />
                                                <Typography variant="headline" component="h2">
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
                                                return (<Card className={classes.card}>
                                                    <CardContent>
                                                        <Typography className={classes.title} color="textSecondary">
                                                            {d.category}
                                                        </Typography>
                                                        <Typography variant="headline" component="h2">
                                                            <span style={{ fontSize: '15px' }}>{d.title}</span><br /><span>{d.firstname + " " + d.lastname}</span>
                                                        </Typography>
                                                        <Typography className={classes.pos} color="textSecondary">
                                                            {d.type}
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
                                            case 'HOSPITAL':
                                                return (<Card className={classes.card}>
                                                    <CardContent>
                                                        <Typography className={classes.title} color="textSecondary">
                                                            {d.category}
                                                        </Typography>
                                                        <Typography variant="headline" component="h2">
                                                            {d.firstname + " " + d.lastname}
                                                        </Typography>
                                                        <Typography className={classes.pos} color="textSecondary">
                                                            {d.type}
                                                        </Typography>
                                                        <Typography component="p">

                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button variant="contained" color="secondary" className={classes.button}>
                                                            Check-in
                              <SendIcon className={classes.rightIcon}></SendIcon>
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
        );
    }
}

export default withRouter(withStyles(styles)(SearchResults));
