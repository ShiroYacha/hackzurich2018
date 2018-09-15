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

class Landpage extends Component {
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
            const isMatch = result => re.test(result.title)

            const filteredResults = _.reduce(
                source,
                (memo, data, name) => {
                    const results = _.filter(data.results, isMatch)
                    if (results.length) memo[name] = { name, results } // eslint-disable-line no-param-reassign

                    return memo
                },
                {},
            )

            this.setState({
                isLoading: false,
                results: filteredResults,
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
