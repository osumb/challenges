import React, { PropTypes } from 'react';
import Media from 'react-media';

import { screenSizes } from '../utils';
import DesktopNav from './desktop-nav';
import Header from './header';
import MobileNav from './mobile-nav';

const { portraitIPad } = screenSizes;

const Navbar = ({ onLogout, router, user }) => (
  <Media query={{ minWidth: portraitIPad.width + 1 }}>
    {(matches) =>
      matches ?
        <div>
          <Header />
          <DesktopNav onLogout={onLogout} router={router} user={user} />
        </div> :
        <MobileNav onLogout={onLogout} router={router} user={user} />
    }
  </Media>
);

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  user: PropTypes.shape({
    admin: PropTypes.bool.isRequired,
    director: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    expires: PropTypes.number.isRequired,
    instrument: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameNumber: PropTypes.string.isRequired,
    part: PropTypes.string.isRequired,
    squadLeader: PropTypes.bool.isRequired
  })
};

export default Navbar;
