import React, { Component, PropTypes } from 'react';

import './completed-results.scss';
import { apiWrapper } from '../utils';
import CompletedResult from './completed-result';

const getEndPoint = '/results/completed';

class CompletedResults extends Component {

  static get propTypes() {
    return {
      performanceResultsMap: PropTypes.object.isRequired
    };
  }

  render() {
    const { performanceResultsMap } = this.props;
    const performanceIds = Object.keys(performanceResultsMap).sort((a, b) => b - a);

    if (performanceIds.length < 1) {
      return <h2>There are no completed results</h2>;
    }

    return (
      <div className="CompletedResults">
        {performanceIds.map((id) => (
          <div key={id}>
            <h1>{performanceResultsMap[id].performanceName}</h1>
            <div className="CompletedResults-results">
              {performanceResultsMap[id].results.map((result) => (
                <CompletedResult key={result.id} {...result} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const Wrapper = apiWrapper(CompletedResults, getEndPoint);

export default Wrapper;
