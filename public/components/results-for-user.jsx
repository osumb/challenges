import React, { PropTypes } from 'react';

import ResultForUser from './result-for-user';

const Results = ({ results }) => (
  <div className="Results">
    {results.map((result) => <ResultForUser key={result.performanceId} {...result} />)}
  </div>
);

Results.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    comments: PropTypes.string.isRequired,
    opponentName: PropTypes.string,
    performanceDate: PropTypes.string.isRequired,
    performanceName: PropTypes.string.isRequired,
    spotId: PropTypes.string.isRequired,
    winner: PropTypes.bool.isRequired
  }))
};

export default Results;
