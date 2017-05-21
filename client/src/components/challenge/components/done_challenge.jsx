import React from 'react';

import { propTypes } from '../../../data/challenge';
import Typography from '../../../components/typography';

const DoneChallenge = ({ challengeType, performance, spot, users, targetUserBuckId, winnerBuckId }) => {
  const targetUser = users.filter(({ buckId }) => buckId === targetUserBuckId)[0];

  return (
    <Typography category="title">
      {targetUser.firstName} challenged for spot {spot.row}{spot.file} for {performance.name} and&nbsp;
      {winnerBuckId === targetUserBuckId ? 'won' : 'lost'}. It was a {challengeType} challenge
    </Typography>
  );
};

DoneChallenge.propTypes = {
  ...propTypes,
  targetUserBuckId: React.PropTypes.string.isRequired
};

export default DoneChallenge;
