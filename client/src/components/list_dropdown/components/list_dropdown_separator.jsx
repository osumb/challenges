import React from 'react';
import PropTypes from 'prop-types';

export default function ListDropdownSeparator({ margin, padding }) {
  return (
    <hr
      className="mdc-list-divider"
      style={{
        margin,
        padding
      }}
    />
  );
}

ListDropdownSeparator.propTypes = {
  margin: PropTypes.string,
  padding: PropTypes.string
};
