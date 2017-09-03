import PropTypes from 'prop-types';

import { propTypes as userProps } from '../user';

const props = {
  expires: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  used: PropTypes.bool.isRequired,
  user: PropTypes.shape(userProps).isRequired
};

export default props;
