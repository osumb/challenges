import React, { PropTypes } from 'react';
import Media from 'react-media';
import pick from 'lodash.pick';
import { withRouter } from 'react-router-dom';

import { auth, screenSizes } from '../../utils';
import DesktopNav from './components/desktop-nav';
import ErrorBanner from './components/error-banner';
import Header from './components/header';
import MobileNav from './components/mobile-nav';

const { portraitIPad } = screenSizes;

const Navbar = ({ onLogout, push }) => {
  const user = auth.getUser();

  function handleLogout() {
    onLogout(push);
  }

  return (
    <div>
      <Media query={{ minWidth: portraitIPad.width + 1 }}>
        {(matches) => matches ?
          <div>
            <Header />
            <DesktopNav onLogout={handleLogout} user={pick(user, DesktopNav.props)} />
          </div>
          : <MobileNav onLogout={handleLogout} push={push} user={pick(user, MobileNav.props)} />
        }
      </Media>
      <ErrorBanner />
    </div>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired
};

export default withRouter(Navbar);
