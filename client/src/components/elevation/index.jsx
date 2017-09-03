import React from 'react';
import PropTypes from 'prop-types';

export default function Elevation({ children, style = {}, zLevel }) {
  return (
    <div
      className={`mdc-elevation--z${zLevel}`}
      style={{
        borderRadius: '8px',
        padding: 10,
        ...style
      }}
    >
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
  style: PropTypes.object,
  zLevel: PropTypes.number.isRequired
};

Elevation.defaultProps = {
  zLevel: 1
};
