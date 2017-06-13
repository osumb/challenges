import React, { PropTypes } from 'react';
import { List } from 'material-ui/List';

import PreviousChallenge from './previous-challenge';

const PreviousChallenges = ({ challenges, userName }) =>
  <List>
    {challenges.map(challenge =>
      <PreviousChallenge
        key={challenge.id}
        userName={userName}
        {...challenge}
      />
    )}
  </List>;

PreviousChallenges.propTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      performanceName: PropTypes.string.isRequired,
      spotId: PropTypes.string.isRequired
    })
  ).isRequired,
  userName: PropTypes.string.isRequired
};

export default PreviousChallenges;
