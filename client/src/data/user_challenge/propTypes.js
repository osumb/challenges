import { PropTypes } from 'react';

import { propTypes as spotProps } from '../spot';

const propTypes = {
  challengeId: PropTypes.number.isRequired,
  challengeSpot: PropTypes.shape(spotProps).isRequired,
  comments: PropTypes.string,
  id: PropTypes.number.isRequired,
  spot: PropTypes.shape(spotProps).isRequired,
  userBuckId: PropTypes.string.isRequired
};

export default propTypes;
