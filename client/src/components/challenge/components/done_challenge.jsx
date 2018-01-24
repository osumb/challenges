import React from 'react';
import PropTypes from 'prop-types';

import { propTypes } from '../../../data/challenge';
import { helpers as userChallengeHelpers } from '../../../data/user_challenge';
import Typography from '../../../components/typography';

const DoneChallenge = ({
  challengeType,
  performance,
  spot,
  userChallenges,
  users,
  targetUserBuckId
}) => {
  const targetUser = users.filter(
    ({ buckId }) => buckId === targetUserBuckId
  )[0];
  const targetUserChallenge = userChallenges.find(
    ({ userBuckId }) => userBuckId === targetUserBuckId
  );
  const { place } = targetUserChallenge;

  return (
    <Typography category="title">
      {targetUser.firstName} challenged for spot {spot.row}
      {spot.file} for {performance.name} and came in&nbsp;
      {userChallengeHelpers.rankingFromPlace(place)}. It was a {challengeType}{' '}
      challenge
    </Typography>
  );
};

DoneChallenge.propTypes = {
  ...propTypes,
  targetUserBuckId: PropTypes.string.isRequired
};

export default DoneChallenge;
