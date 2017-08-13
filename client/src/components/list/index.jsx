import React from 'react';
import PropTypes from 'prop-types';

import Typography from '../typography';

const List = ({ children }) =>
  <ul className="mdc-list">
    {React.Children.count(children) <= 0
      ? <Typography category="subheading" number={2}>
          Empty List
        </Typography>
      : children}
  </ul>;

const ListItem = ({ children }) =>
  <li className="mdc-list-item">
    {children}
  </li>;

const ListSeparator = () => <hr className="mdc-list-divider" />;

List.propTypes = { children: PropTypes.any };
ListItem.propTypes = { children: PropTypes.any };

export { List, ListItem, ListSeparator };
