import React from 'react';

const SideNav = ({ children }) =>
  <nav className="mdc-permanent-drawer mdc-typography">
    <nav className="mdc-list">
      {children}
    </nav>
  </nav>;

export default SideNav;
