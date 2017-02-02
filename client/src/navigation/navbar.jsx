import React, { PropTypes } from 'react';
import Media from 'react-media';
import { withRouter } from 'react-router-dom';

import { auth, screenSizes } from '../utils';
import DesktopNav from './desktop-nav';
import ErrorBanner from '../shared-components/error-banner';
import Header from '../shared-components/header';
import MobileNav from './mobile-nav';

const { portraitIPad } = screenSizes;

const Navbar = ({ onLogout, push }) => {
  const user = auth.getUser();

  function handleLogout() {
    onLogout(push);
  }

  return (
    <div>
      <Media query={{ minWidth: portraitIPad.width + 1 }}>
        {(matches) =>
          matches ?
            <div>
              <Header />
              <DesktopNav onLogout={handleLogout} user={user} />
            </div> :
            <MobileNav onLogout={handleLogout} push={push} user={user} />
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
