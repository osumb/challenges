import { PropTypes } from 'react';

import helpers from './helpers';
import { propTypes as spotProps } from '../spot';

const propTypes = {
  buckId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  instrument: PropTypes.oneOf(Object.values(helpers.instruments)).isRequired,
  lastName: PropTypes.string.isRequired,
  part: PropTypes.oneOf(Object.values(helpers.parts)).isRequired,
  role: PropTypes.oneOf(Object.values(helpers.roles)),
  spot: PropTypes.shape(spotProps)
};

export default propTypes;
