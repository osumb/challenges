import React, { PropTypes } from 'react';
import { CardTitle } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';

import PreviousChallenge from './previous-challenge';

const PreviousChallenges = ({ challenges, userName }) => (
  <List>
    <CardTitle title="Previous Challenges" />
    {challenges.map((challenge) =>
      <span key={challenge.id}>
        <Divider />
        <PreviousChallenge userName={userName} {...challenge} />
      </span>
    )}
  </List>
);

PreviousChallenges.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    performanceName: PropTypes.string.isRequired,
    spotId: PropTypes.string.isRequired
  })).isRequired,
  userName: PropTypes.string.isRequired
};

export default PreviousChallenges;
