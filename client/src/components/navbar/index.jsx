import React from 'react';
import Media from 'react-media';
import pick from 'lodash.pick';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { auth, screenSizes } from '../../utils';
import DesktopNav from './components/desktop-nav';
import ErrorBanner from './components/error-banner';
import MobileNav from './components/mobile-nav';
import ScriptOhioWhite from '../../assets/images/script-ohio-white.png';
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

const Navbar = ({ onLogout, history }) => {
  const user = auth.getUser();

  function handleLogout() {
    onLogout(history.push);
  }

  return (
    <div>
      <Media query={{ minWidth: portraitIPad.width - 1 }}>
        {matches =>
          matches
            ? <HeaderDiv>
                <ToolBar
                  iconElementRight={
                    <Image src={ScriptOhioWhite} alt="ScriptOhioWhite.png" />
                  }
                  title="&nbsp;OSUMB Challenge Manager"
                />
                <DesktopNav
                  onLogout={handleLogout}
                  user={pick(user, DesktopNav.props)}
                />
              </HeaderDiv>
            : <MobileNav
                onLogout={handleLogout}
                push={history.push}
                user={pick(user, MobileNav.props)}
              />}
      </Media>
      <ErrorBanner />
    </div>
  );
};

Navbar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withRouter(Navbar);
