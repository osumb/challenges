import React from 'react';

export default function Typography({ category, children, number }) {
  return (
    <div className={`mdc-typography--${category || 'caption'}${number || ''}`}>
      {children}
    </div>
  );
}

Typography.propTypes = {
  category: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  number: React.PropTypes.number
};
