import React from 'react';
import PropTypes from 'prop-types';

export default function ListDropdownItem({ children }) {
  return typeof children === 'string'
    ? <li className="mdc-list-item">{children}</li>
    : React.cloneElement(children, { className: 'mdc-list-item' });
}

ListDropdownItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired
};
