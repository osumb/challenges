import { PropTypes } from 'react';

import { propTypes as performanceProps } from '../performance';
import { propTypes as spotProps } from '../spot';
import { propTypes as userProps } from '../user';

const propTypes = {
  challengeType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  performance: PropTypes.shape(performanceProps.performance),
  spot: PropTypes.shape(spotProps),
  users: PropTypes.arrayOf(PropTypes.shape(userProps)),
  winnerBuckId: PropTypes.string
};

export default propTypes;
