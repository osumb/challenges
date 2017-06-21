import React from 'react';
import PropTypes from 'prop-types';

export default function Typography({ category, children, number }) {
  return (
    <div className={`mdc-typography--${category || 'caption'}${number || ''}`}>
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
  number: PropTypes.number
};
