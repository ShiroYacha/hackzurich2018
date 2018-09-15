import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Ionicon from 'react-ionicons'

const styles = {
  card: {
    width: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
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
};

class SearchResults extends Component {

  constructor() {
    super();
    this.state = {
      symptoms: [1, 2, 3, 4, 5],
      drugs: [],
      doctors: []
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div style={{ margin: 'auto', width: '80vw', height: '80vh' }}>
          <h2>Search results</h2>
          <div style={{ display: 'flex' }}>
            <div
              style={{ width: '30%' }}>
              <div style={{ display: 'flex', marginBottom: '25px' }}>
                <Ionicon icon="ios-thermometer" fontSize="30px" />
                <Typography className={classes.categoryTitle} color="textSecondary">
                          Symptoms
                </Typography>
              </div>
              <StackGrid
                columnWidth={200}
                gutterWidth={10}
                gutterHeight={10}
              >
                {
                  this.state.symptoms.map(s => {
                    return (<Card className={classes.card}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                          Word of the Day
                        </Typography>
                        <Typography variant="headline" component="h2">
                          Test
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          adjective
                        </Typography>
                        <Typography component="p">
                          well meaning and kindly.
                          <br />
                          {'"a benevolent smile"'}
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
                <Ionicon icon="ios-pizza" fontSize="30px" />
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
                  this.state.symptoms.map(s => {
                    return (<Card className={classes.card}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                          Word of the Day
                        </Typography>
                        <Typography variant="headline" component="h2">
                          Test
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          adjective
                        </Typography>
                        <Typography component="p">
                          well meaning and kindly.
                          <br />
                          {'"a benevolent smile"'}
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
                <Ionicon icon="ios-medkit" fontSize="30px" />
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
                  this.state.symptoms.map(s => {
                    return (<Card className={classes.card}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                          Word of the Day
                        </Typography>
                        <Typography variant="headline" component="h2">
                          Test
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          adjective
                        </Typography>
                        <Typography component="p">
                          well meaning and kindly.
                          <br />
                          {'"a benevolent smile"'}
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
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SearchResults);
