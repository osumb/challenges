import React, { PropTypes } from 'react';

import './past-results.scss';
import ApiWrapper from './api-wrapper';
import Result from './result';

const renderPastResults = ({ performanceResultsMap }) => {
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
};

renderPastResults.propTypes = {
  performanceResultsMap: PropTypes.object.isRequired
};

const PastResults = () => (
  <ApiWrapper url="/results" component={renderPastResults} />
);

export default PastResults;
