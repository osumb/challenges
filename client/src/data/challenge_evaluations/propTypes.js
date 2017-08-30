import PropTypes from 'prop-types';

import { propTypes as performanceProps } from '../performance';
import { propTypes as spotProps } from '../spot';
import { propTypes as userProps } from '../user';

const userChallengeForEvaluationPropTypes = {
  challengeId: PropTypes.number.isRequired,
  comments: PropTypes.string,
  id: PropTypes.number.isRequired,
  place: PropTypes.number,
  user: PropTypes.shape(userProps),
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

const challengeForEvaluationWithUserChallengesObjectPropTypes = {
  ...challengeForEvaluationPropTypes,
  userChallenges: (props, propName, componentName) => {
    // eslint-disable-next-line consistent-return
    Object.keys(props[propName]).forEach(userChallengeId => {
      if (typeof userChallengeId !== 'string') {
        return new Error(
          `${propName} must be of form { [key: string]: UserChallenge } for ${componentName}`
        );
      }
    });

    Object.keys(props[propName]).forEach(userChallengeId => {
      PropTypes.checkPropTypes(
        userChallengeForEvaluationPropTypes,
        props[propName][userChallengeId],
        `userChallenge for key ${userChallengeId}`,
        componentName
      );
    });

    return null;
  }
};

const challengesForEvaluationPropTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.shape(challengeForEvaluationPropTypes)
  ).isRequired
};

export default {
  challengeForEvaluationPropTypes,
  challengesForEvaluationPropTypes,
  challengeForEvaluationWithUserChallengesObjectPropTypes,
  userChallengeForEvaluationPropTypes
};
