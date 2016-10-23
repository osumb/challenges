import React, { Component } from 'react';

import './past-results.scss';
import { api } from '../utils';
import Result from './result';

export default class PastResults extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      performanceResultsMap: null
    };
  }

  componentDidMount() {
    api.get('/results')
    .then(({ performanceResultsMap }) => {
      this.setState({
        loading: false,
        performanceResultsMap
      });
    });
  }

  render() {
    const { loading, performanceResultsMap } = this.state;

    if (loading) {
      return <div className="PastResults">Loading...</div>;
    }

    const performanceIds = Object.keys(performanceResultsMap).sort((a, b) => b - a);

    if (performanceIds.length <= 0) {
      return <h2>There are no previous results</h2>;
    }

    return (
      <div className="PastResults">
        {performanceIds.map((id) =>
          (
            <div key={id}>
              <h1>{performanceResultsMap[id].performanceName}</h1>
              <div className="PastResults-results">
                {performanceResultsMap[id].results.map((result) =>
                  <Result key={result.id} {...result} />
                )}
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}
