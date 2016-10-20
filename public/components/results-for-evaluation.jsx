import React, { Component } from 'react';

import './results-for-evaluation.scss';
import { api } from '../utils';
import ResultForEvaluation from './result-for-evaluation';

class Evaluate extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      results: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    api.get('/results/evaluate')
    .then(({ results }) => {
      this.setState({
        loading: false,
        results
      });
    });
  }

  handleSubmit(id, firstComments, secondComments, spotId, winnerId) {
    const { results } = this.state;

    api.put('/results/evaluate', {
      id,
      firstComments,
      secondComments: secondComments || '',
      spotId,
      winnerId
    })
    .then(() => {
      const newResults = results.filter(({ id: rId }) => id !== rId);

      this.setState({
        results: newResults
      });
    });
  }

  render() {
    const { loading, results } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (results.length <= 0) {
      return <h2>There are no challenges to evaluate!</h2>;
    }

    return (
      <div className="ResultsForEvaluation">
        <h2 className="ResultsForEvaluation-header">Evaluate Challenges</h2>
        {results.map((result) => <ResultForEvaluation key={result.id} onSubmit={this.handleSubmit} {...result} />)}
      </div>
    );
  }
}

export default Evaluate;
