import { PropTypes } from 'react';

const propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  windowClose: PropTypes.string.isRequired,
  windowOpen: PropTypes.string.isRequired
};

export default propTypes;
