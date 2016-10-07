import React, { PropTypes } from 'react';

import './navbar.scss';

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="Navbar-item" />
    </div>
  );
};

Navbar.propTypes = {
  user: PropTypes.object
};

export default Navbar;
