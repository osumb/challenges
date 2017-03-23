import { PropTypes } from 'react';

import { propTypes as spotProps } from '../spot';
import { propTypes as performanceProps } from '../performance';

const propTypes = {
  challengeType: PropTypes.string,
  performance: PropTypes.shape(performanceProps.performance),
  spot: PropTypes.shape(spotProps)
};

export default propTypes;
