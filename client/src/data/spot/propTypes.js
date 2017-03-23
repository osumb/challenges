import { PropTypes } from 'react';

const propTypes = {
  file: PropTypes.number.isRequired,
  row: PropTypes.oneOf(['A', 'B', 'C', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'Q', 'R', 'S', 'T', 'X']).isRequired
};

export default propTypes;
