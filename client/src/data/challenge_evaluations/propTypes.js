import PropTypes from 'prop-types';

import { propTypes as performanceProps } from '../performance';
import { propTypes as spotProps } from '../spot';
import { propTypes as userProps } from '../user';

const userChallengeForEvaluationPropTypes = {
  challengeId: PropTypes.number.isRequired,
  comments: PropTypes.string,
  id: PropTypes.number.isRequired,
  user: PropTypes.shape(userProps).isRequired,
  userBuckId: PropTypes.string.isRequired
};

const challengeForEvaluationPropTypes = {
  challengeType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  performance: PropTypes.shape(performanceProps.performance),
  spot: PropTypes.shape(spotProps),
  userChallenges: PropTypes.arrayOf(
    PropTypes.shape(userChallengeForEvaluationPropTypes)
  ),
  users: PropTypes.arrayOf(PropTypes.shape(userProps))
};

const challengesForEvaluationPropTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.shape(challengeForEvaluationPropTypes)
  ).isRequired
};

export default {
  challengeForEvaluationPropTypes,
  challengesForEvaluationPropTypes,
  userChallengeForEvaluationPropTypes
};
