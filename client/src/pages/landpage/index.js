import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import './style.css';
import _ from 'lodash';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';

const getResults = () =>
    [
        {title: 'I have a headache', description: 'some desc', image: '', price: ''},
        {title: 'I have a stomach ache', description: 'some desc 2', image: '', price: ''},
        {title: 'I have back pain', description: 'some desc 3', image: '', price: ''},
        {title: 'I have flu', description: 'some desc 4', image: '', price: ''},
    ];

const categories = ['symptoms', 'drugs', 'doctors'];
const source = categories.reduce((memo, name) => {
    // eslint-disable-next-line no-param-reassign
    memo[name] = {
        name,
        results: getResults(),
    }

    return memo
}, {})

const searchResults = {
    issues: [],
    drugs:[],
    doctors: []
}

class Landpage extends Component {

    constructor() {
        super();
        this.state = {
            issues: [],
            drugs: [],
            doctors: []
        };
    }

    componentDidMount(){
        const db = firebase.firestore();
        // listen to issues
        this.unsubscribeIssuesListener = db.collection('issues').onSnapshot(refs=>{
            const issues = [];
            refs.forEach(ref=>{
                var data = ref.data();
                data.id = ref.id;
                issues.push(data);
            });
            this.setState({issues: issues});
            console.log(issues);
        });
        // listen to drugs
        this.unsubscribeDrugsListener = db.collection('drugs').onSnapshot(refs=>{
            const drugs = [];
            refs.forEach(ref=>{
                var data = ref.data();
                data.id = ref.id;
                drugs.push(data);
            });
            this.setState({drugs: drugs});
        });
        // listen to doctors
        this.unsubscribeDoctorsListener = db.collection('doctors').onSnapshot(refs=>{
            const doctors = [];
            refs.forEach(ref=>{
                var data = ref.data();
                data.id = ref.id;
                doctors.push(data);
            });
            this.setState({doctors: doctors});
        });
    }

    componentWillUnmount(){
        this.unsubscribeIssuesListener();
        this.unsubscribeDrugsListener();
        this.unsubscribeDoctorsListener();
    }

    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = property => result => re.test(result[property])

            const searchRes = {};
            searchRes.issues = {
                name: 'Issues',
                results: this.state.issues
                    .filter(isMatch('symptom'))
                    .map(item => ({title: item.name, description: item.icdName}))
            };

            searchRes.drugs = {
                name: 'Drugs',
                results: this.state.drugs
                    .filter(isMatch('name'))
                    .map(item => ({title: item.name, description: item.description}))
            };

            searchRes.doctors = {
                name: 'Doctors',
                results: this.state.doctors
                    .filter(isMatch('lastname'))
                    .map(item => ({title: item.title+" "+item.lastname+", "+item.firstname, description: "Group: "+item.group+" "+" Type: "+item.type}))
            };

            console.log('searchRes', searchRes);

            this.setState({
                isLoading: false,
                results: searchRes,
            })
        }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state

        return (
            <Grid>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6} className="full-height">
                    <div></div>
                    <Search
                        className='custom-searchbar'
                        category
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                </Grid.Column>
                <Grid.Column width={5}></Grid.Column>
                {/*<Grid.Column width={8}>
                    <Segment>
                        <Header>State</Header>
                        <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
                        <Header>Options</Header>
                        <pre style={{ overflowX: 'auto' }}>{JSON.stringify(source, null, 2)}</pre>
                    </Segment>
                </Grid.Column>*/}
            </Grid>
        )
    }
}

export default Landpage;
