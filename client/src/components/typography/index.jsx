import React from 'react';
import PropTypes from 'prop-types';

export default function Typography({ category, children, number, style = {} }) {
  return (
    <div
      className={`mdc-typography--${category || 'caption'}${number || ''}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}

Typography.propTypes = {
  category: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  number: PropTypes.number,
  style: PropTypes.object
};
