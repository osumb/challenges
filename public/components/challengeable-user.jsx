import React, { PropTypes } from 'react';

const ChallengeableUser = ({ challengeFull, challengedCount, name, spotId, spotOpen }) => {
  const optionText = spotOpen ? `open - challenged ${challengedCount} time(s)` : name;

  if (challengeFull) {
    return (
      <option disabled value={spotId}>
        {spotId}: {optionText}
      </option>
    );
  } else {
    return (
      <option value={spotId}>
        {spotId}: {optionText}
      </option>
    );
  }
};

ChallengeableUser.propTypes = {
  challengeFull: PropTypes.bool.isRequired,
  challengedCount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  spotOpen: PropTypes.bool.isRequired
};

export default ChallengeableUser;
