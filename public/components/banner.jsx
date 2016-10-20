import React, { PropTypes } from 'react';

import './banner.scss';

const Banner = ({ message }) => {
  return (
    <h2 className="Banner">**{message}**</h2>
  );
};

Banner.propTypes = {
  message: PropTypes.string.isRequired
};

export default Banner;
