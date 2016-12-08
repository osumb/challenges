import React from 'react';
import AppBar from 'material-ui/AppBar';
import { grey800, red900 } from 'material-ui/styles/colors';

import './header.scss';

const Header = () => (
  <AppBar
    className="Header"
    style={{
      backgroundColor: grey800,
      borderBottom: `6px solid ${red900}`
    }}
    iconElementLeft={<span />}
    iconElementRight={<img className="Header-image" src="/images/script-ohio-white.png" />}
    title="OSUMB Challenge Manager"
  />

);

export default Header;
