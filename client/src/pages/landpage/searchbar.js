import React, { Component } from 'react';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/database';
import { BrowserRouter as Router, withRouter, Route, Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import './style.css';
import _ from 'lodash';
import debounce from 'debounce';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';

const getResults = () =>
    [
        { title: 'I have a headache', description: 'some desc', image: '', price: '' },
        { title: 'I have a stomach ache', description: 'some desc 2', image: '', price: '' },
        { title: 'I have back pain', description: 'some desc 3', image: '', price: '' },
        { title: 'I have flu', description: 'some desc 4', image: '', price: '' },
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
    drugs: [],
    doctors: []
}

class SearchBar extends Component {

    constructor() {
        super();
        this.state = {
            issues: [],
            drugs: [],
            doctors: [],
            value: '',
        };
        this._debounceSearchFb.bind(this);
    }

    componentDidMount() {
        const db = firebase.firestore();
        // listen to issues
        this.unsubscribeIssuesListener = db.collection('issues').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const issues = data.results;
                this.setState({ issues }, ()=> {
                    this.updateSuggestions(this.state.search);
                });
            }
        });
        // listen to drugs
        this.unsubscribeDrugsListener = db.collection('drugs').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const drugs = data.results;
                this.setState({ drugs }, ()=> {
                    this.updateSuggestions(this.state.search);
                });
            }
        });
        // listen to doctors
        this.unsubscribeDoctorsListener = db.collection('doctors').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const doctors = data.results;
                this.setState({ doctors }, ()=> {
                    this.updateSuggestions(this.state.search);
                });
            }
        });
        // listen to symptoms
        this.unsubscribeSymptomsListener = db.collection('symptoms').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const symptoms = data.results;
                this.setState({ symptoms }, ()=> {
                    this.updateSuggestions(this.state.search);
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribeIssuesListener();
        this.unsubscribeDrugsListener();
        this.unsubscribeDoctorsListener();
        this.unsubscribeSymptomsListener();
    }

    componentWillMount() {
        this.resetComponent()
    }

    removeNonSearch = (value) => {
        const stringArr = value.split(' ');
        const nonSearch = ['I', 'have', 'a', 'an'];
        return stringArr.map(w => nonSearch.includes(w) ? null : w).filter(x => x).join(' ');
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.props.history.push('/searchresults?search=' + result.title);
        this.setState({ value: result.title });
    }

    _debounceSearchFb = debounce(function () {
        const db = firebase.firestore();
        db.collection('search').doc('demo').set({ query: this.state.search });
    }, 500);

    searchFb = () => {
        this._debounceSearchFb();
    }

    updateSuggestions = (search) => {
        const re = new RegExp(_.escapeRegExp(search), 'i')
        const isMatch = property => result => re.test(result[property])

        const searchRes = {};

        if (this.state.symptoms) {
            searchRes.symptoms = {
                name: 'Symptoms',
                results: this.state.symptoms
                    .filter(isMatch('name'))
                    .map(item => ({ title: item.name }))
            }
        }

        if (this.state.issues) {
            searchRes.issues = {
                name: 'Issues',
                results: this.state.issues
                    .filter(isMatch('symptom'))
                    .map(item => ({ title: item.name + " (" + item.symptom + " caused by)", description: item.icdname }))
            };
        }

        if (this.state.drugs) {
            searchRes.drugs = {
                name: 'Drugs',
                results: this.state.drugs
                    .filter(isMatch('name'))
                    .map(item => ({ title: item.name, description: item.description }))
            };
        }

        if (this.state.doctors) {
            searchRes.doctors = {
                name: 'Doctors',
                results: this.state.doctors
                    .filter(isMatch('lastname'))
                    .map(item => ({ title: item.title + " " + item.lastname + ", " + item.firstname, description: "Group: " + item.group + " " + " Type: " + item.type }))
            };
        }

        if(searchRes.symptoms && !searchRes.symptoms.results.length)delete searchRes.symptoms;
        if(searchRes.drugs && !searchRes.drugs.results.length)delete searchRes.drugs;
        if(searchRes.doctors && !searchRes.doctors.results.length)delete searchRes.doctors;
        if(searchRes.issues && !searchRes.issues.results.length)delete searchRes.issues;
        console.log('searchRes', searchRes);
        this.setState({isLoading: false, results: searchRes});
        return searchRes;
    }

    handleSearchChange = (e, { value }) => {
        const search = this.removeNonSearch(value);
        this.setState({ isLoading: true, value, search }, () => {
            this.updateSuggestions(this.state.search);
        })

        if (value.length < 1) return this.resetComponent()

        this.searchFb();

    }

    render() {
        const { isLoading, value, results } = this.state;
        const { noSuggestions } = this.props;
        return (
            <Search
                className={`custom-searchbar ${noSuggestions ? 'no-suggestions' : ''}`}
                category
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={results}
                value={value}
                {...this.props}
            />
        )
    }
}

export default withRouter(SearchBar);
