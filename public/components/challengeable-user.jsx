import React, { PropTypes } from 'react';

const ChallengeableUser = ({ challengeFull, challengedCount, key, name, spotId, spotOpen }) => {
  const optionText = spotOpen ? `open - challenged ${challengedCount} time(s)` : name;

  if (challengeFull) {
    return (
      <option disabled key={key} value={spotId}>
        {spotId}: {optionText}
      </option>
    );
  } else {
    return (
      <option key={key} value={spotId}>
        {spotId}: {optionText}
      </option>
    );
  }
};

ChallengeableUser.propTypes = {
  challengeFull: PropTypes.bool.isRequired,
  challengedCount: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  spotOpen: PropTypes.bool.isRequired
};

export default ChallengeableUser;
