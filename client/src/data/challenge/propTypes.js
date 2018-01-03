import PropTypes from 'prop-types';

import { propTypes as userChallengeProps } from '../user_challenge';
import { propTypes as performanceProps } from '../performance';
import { propTypes as spotProps } from '../spot';
import { propTypes as userProps } from '../user';

const propTypes = {
  challengeType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  performance: PropTypes.shape(performanceProps.performance),
  spot: PropTypes.shape(spotProps),
  userChallenges: PropTypes.arrayOf(PropTypes.shape(userChallengeProps)),
  users: PropTypes.arrayOf(PropTypes.shape(userProps))
};

export default propTypes;
