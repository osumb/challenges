import React from 'react';

import classnames from 'classnames';

const SideNavItem = ({ active, onClick, subtitle, title }) => (
  <a
    className={classnames('mdc-list-item', { 'mdc-permanent-drawer--selected': active })}
    onClick={onClick}
  >
    <i
      className="material-icons mdc-list-item__start-detail"
      aria-hidden="true"
    >
      {title}
    </i>
    {subtitle}
  </a>
);

export default SideNavItem;
