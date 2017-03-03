import React from 'react';
import AppBar from 'material-ui/AppBar';
import { grey800, red900 } from 'material-ui/styles/colors';
import styled from 'styled-components';
import ToolBar from '../../tool_bar';

import './header.scss';
const Image = styled.img`
  height: 60px;
  padding: 5px 5px 5px 0;
  width: 130px;
`;

const Header = () => (
  <ToolBar
    iconElementRight={<Image src="/images/script-ohio-white.png" />}
    title="OSUMB Challenge Manager"
  />
);

export default Header;
