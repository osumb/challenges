import { PropTypes } from 'react';

import { propTypes as performanceProps } from '../performance';

const propTypes = {
  id: PropTypes.number.isRequired,
  reason: PropTypes.string.isRequired,
  openSpot: PropTypes.bool.isRequired,
  allowedToChallenge: PropTypes.bool.isRequired,
  performance: PropTypes.shape(performanceProps.performance),
  userBuckId: PropTypes.string
};

export default propTypes;
