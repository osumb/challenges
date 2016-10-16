import React, { PropTypes } from 'react';

import Result from './result';

const Results = ({ results }) => (
  <div className="Results">
    {results.map((result) => <Result key={result.performanceId} {...result} />)}
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
