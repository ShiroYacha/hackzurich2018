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
            doctors: []
        };
        this._debounceSearchFb.bind(this);
    }

    componentDidMount() {
        const db = firebase.firestore();
        // listen to issues
        this.unsubscribeIssuesListener = db.collection('issues').onSnapshot(refs => {
            const issues = [];
            refs.forEach(ref => {
                var data = ref.data();
                data.id = ref.id;
                issues.push(data);
            });
            this.setState({ issues: issues });
            console.log(issues);
        });
        // listen to drugs
        this.unsubscribeDrugsListener = db.collection('drugs').onSnapshot(refs => {
            const drugs = [];
            refs.forEach(ref => {
                var data = ref.data();
                data.id = ref.id;
                drugs.push(data);
            });
            this.setState({ drugs: drugs });
        });
        // listen to doctors
        this.unsubscribeDoctorsListener = db.collection('doctors').onSnapshot(refs => {
            const doctors = [];
            refs.forEach(ref => {
                var data = ref.data();
                data.id = ref.id;
                doctors.push(data);
            });
            this.setState({ doctors: doctors });
        });
        // listen to symptoms
        this.unsubscribeSymptomsListener = db.collection('symptoms').doc('demo').onSnapshot(ref => {
            var data = ref.data();
            if (data) {
                const symptoms = data.results.slice(0, 5);
                this.setState({ symptoms: symptoms });
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

    handleSearchChange = (e, { value }) => {
        const search = this.removeNonSearch(value);
        this.setState({ isLoading: true, value, search })

        if (value.length < 1) return this.resetComponent()

        const db = firebase.firestore();

        this.searchFb();

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
                    .map(item => ({ title: item.name + " (" + item.symptom + " caused by)", description: item.icdName }))
            };
        }

        searchRes.drugs = {
            name: 'Drugs',
            results: this.state.drugs
                .filter(isMatch('name'))
                .map(item => ({ title: item.name, description: item.description }))
        };

        searchRes.doctors = {
            name: 'Doctors',
            results: this.state.doctors
                .filter(isMatch('lastname'))
                .map(item => ({ title: item.title + " " + item.lastname + ", " + item.firstname, description: "Group: " + item.group + " " + " Type: " + item.type }))
        };

        console.log('searchRes', searchRes);

        this.setState({
            isLoading: false,
            results: searchRes,
        })
    }

    render() {
        const { isLoading, value, results } = this.state

        return (
            <Search
                className='custom-searchbar'
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
