import React, { PropTypes } from 'react';
import Media from 'react-media';
import pick from 'lodash.pick';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { auth, screenSizes } from '../../utils';
import DesktopNav from './components/desktop-nav';
import ErrorBanner from './components/error-banner';
import MobileNav from './components/mobile-nav';
import ToolBar from '../tool_bar';

const { portraitIPad } = screenSizes;
const Image = styled.img`
  height: 60px;
  padding: 5px 5px 5px 0;
  width: 130px;
`;
const HeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Navbar = ({ onLogout, push }) => {
  const user = auth.getUser();

  function handleLogout() {
    onLogout(push);
  }

  return (
    <div>
      <Media query={{ minWidth: portraitIPad.width + 1 }}>
        {(matches) => matches ?
          <HeaderDiv>
            <ToolBar
              iconElementRight={<Image src="/images/script-ohio-white.png" />}
              title="&nbsp;OSUMB Challenge Manager"
            />
            <DesktopNav onLogout={handleLogout} user={pick(user, DesktopNav.props)} />
          </HeaderDiv>
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