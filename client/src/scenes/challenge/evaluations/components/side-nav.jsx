import React from 'react';

const SideNav = ({ children }) => (
  <nav className="mdc-permanent-drawer mdc-typography">
    <nav id="icon-with-text-demo" className="mdc-list">
      {children}
    </nav>
  </nav>
);

export default SideNav;
