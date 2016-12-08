import React, { PropTypes } from 'react';
import Media from 'react-media';

import DesktopNav from './desktop-nav';
import Header from './header';
import MobileNav from './mobile-nav';

// width of iPad in portrait
const minWidth = 769;

const Navbar = ({ onLogout, user }) => (
  <Media query={{ minWidth }}>
    {(matches) =>
      matches ?
        <div className="Navbar">
          <Header />
          <DesktopNav onLogout={onLogout} user={user} />
        </div> :
        <MobileNav onLogout={onLogout} user={user} />
    }
  </Media>
);

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    admin: PropTypes.bool.isRequired,
    director: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    expires: PropTypes.number.isRequired,
    instrument: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameNumber: PropTypes.string.isRequired,
    part: PropTypes.string.isRequired,
    revokeTokenDate: PropTypes.number.isRequired,
    spotOpen: PropTypes.bool.isRequired,
    squadLeader: PropTypes.bool.isRequired
  })
};

export default Navbar;
