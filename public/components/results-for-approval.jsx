import React, { Component } from 'react';

import './results-for-approval.scss';
import { api } from '../utils';
import ResultForApproval from './result-for-approval';

class ResultsForApproval extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      results: []
    };
    this.handleApproveAll = this.handleApproveAll.bind(this);
    this.handleApproveOne = this.handleApproveOne.bind(this);
  }

  componentDidMount() {
    api.get('/results/approve')
    .then(({ results }) => {
      this.setState({
        loading: false,
        results
      });
    });
  }

  handleApproveOne(id) {
    api.put('/results/approve', {
      ids: [id]
    })
    .then(() => {
      const { results } = this.state;

      const newResults = results.filter(({ id: rId }) => rId !== id);

      this.setState({
        ...this.state,
        results: newResults
      });
    });
  }

  handleApproveAll() {
    api.put('/results/approve', {
      ids: this.state.results.map(({ id }) => id)
    })
    .then(() => {
      this.setState({
        ...this.state,
        results: []
      });
    });
  }

  render() {
    const { loading, results } = this.state;

    if (loading) {
      return <div className="ResultsForApproval">Loading...</div>;
    }

    if (results.length <= 0) {
      return <h2>No results to approve!</h2>;
    }

    return (
      <div className="ResultsForApproval">
        <div className="ResultsForApproval-header">
          <h2>Approve Results</h2>
          <button className="ResultsForApproval-all" onClick={this.handleApproveAll}>Approve All</button>
        </div>
        <div className="ResultsForApproval-results">
          {results.map((result) => <ResultForApproval key={result.id} {...result} onApprove={this.handleApproveOne} />)}
        </div>
      </div>
    );
  }
}

export default ResultsForApproval;
