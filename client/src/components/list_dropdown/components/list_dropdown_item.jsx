import React from 'react';

export default function ListDropdownItem({ children }) {
  return typeof children === 'string'
    ? <li className="mdc-list-item">{children}</li>
    : React.cloneElement(children, { className: 'mdc-list-item' });
}

ListDropdownItem.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string
  ]).isRequired
};
