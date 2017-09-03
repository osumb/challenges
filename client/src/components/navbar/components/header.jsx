import React from 'react';
import styled from 'styled-components';
import ToolBar from '../../tool_bar';

const Image = styled.img`
  height: 60px;
  padding: 5px 5px 5px 0;
  width: 130px;
`;

const Header = () =>
  <ToolBar
    iconElementRight={<Image src="/images/script-ohio-white.png" />}
    title="OSUMB Challenge Manager"
  />;

export default Header;
