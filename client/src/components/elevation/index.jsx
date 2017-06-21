import React from 'react';
import PropTypes from 'prop-types';

export default function Elevation({ children, zLevel }) {
  return (
    <div className={`mdc-elevation--z${zLevel}`}>
      {children}
    </div>
  );
}

Elevation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
      ])
    )
  ]).isRequired,
  zLevel: PropTypes.number.isRequired
};

Elevation.defaultProps = {
  zLevel: 1
};
