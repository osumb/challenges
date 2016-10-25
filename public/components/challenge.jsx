import React, { PropTypes } from 'react';

const Challenge = ({ owner, performanceName, spotId }) => (
  <h3 className="Challenge">
    {owner ? 'You\'re currently signed up to challenged' : 'Challenged'} {spotId} for {performanceName}
  </h3>
);

Challenge.propTypes = {
  owner: PropTypes.bool.isRequired,
  performanceName: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired
};

export default Challenge;
