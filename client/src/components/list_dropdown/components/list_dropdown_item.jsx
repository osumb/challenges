import React from 'react';
import PropTypes from 'prop-types';

export const ITEM_HEIGHT = 48;

export default function ListDropdownItem({ children }) {
  return typeof children === 'string'
    ? <li className="mdc-list-item">
        {children}
      </li>
    : React.cloneElement(children, { className: 'mdc-list-item' });
}

ListDropdownItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired
};
