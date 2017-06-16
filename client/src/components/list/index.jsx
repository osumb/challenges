import React from 'react';

import Typography from '../typography';

const List = ({ children }) =>
  <ul className="mdc-list">
    {React.Children.count(children) <= 0
      ? <Typography category="subheading" number={2}>Empty List</Typography>
      : children}
  </ul>;

const ListItem = ({ children }) =>
  <li className="mdc-list-item">
    {children}
  </li>;

const ListSeparator = () =>
  <hr role="separator" className="mdc-list-divider" />;

List.propTypes = { children: React.PropTypes.any };
ListItem.propTypes = { children: React.PropTypes.any };

export { List, ListItem, ListSeparator };
