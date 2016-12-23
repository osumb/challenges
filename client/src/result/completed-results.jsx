import React, { Component, PropTypes } from 'react';

import './completed-results.scss';
import ApiWrapper from '../shared-components/api-wrapper';
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
    const performanceIds = Object.keys(performanceResultsMap).sort();

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

const Wrapper = () => <ApiWrapper endPoint={getEndPoint} container={CompletedResults} />;

export default Wrapper;
