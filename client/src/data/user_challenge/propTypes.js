import PropTypes from 'prop-types';

import { propTypes as spotProps } from '../spot';

const propTypes = {
  challengeId: PropTypes.number.isRequired,
  challengeSpot: PropTypes.shape(spotProps).isRequired,
  comments: PropTypes.string,
  id: PropTypes.number.isRequired,
  place: PropTypes.number.isRequired,
  spot: PropTypes.shape(spotProps).isRequired,
  userBuckId: PropTypes.string.isRequired
};

export default propTypes;
