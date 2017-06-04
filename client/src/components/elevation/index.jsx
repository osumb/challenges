import React from 'react';

export default function Elevation({ children, zLevel }) {
  return (
    <div className={`mdc-elevation--z${zLevel}`}>
      {children}
    </div>
  );
}

Elevation.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.node,
    React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.arrayOf(React.PropTypes.element)]))
  ]).isRequired,
  zLevel: React.PropTypes.number.isRequired
};

Elevation.defaultProps = {
  zLevel: 1
};
