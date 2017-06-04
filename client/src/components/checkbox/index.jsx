import React from 'react';

import './index.scss';

const Checkbox = ({ disabled, label, getRef }) => (
  <div className="mdc-form-field">
    <div className="mdc-checkbox mdc-theme--challenges">
      <input
        disabled={disabled}
        type="checkbox"
        className="mdc-checkbox__native-control"
        ref={getRef}
      />
      <div className="mdc-checkbox__background">
        <svg
          className="mdc-checkbox__checkmark"
          viewBox="0 0 24 24"
        >
          <path
            className="mdc-checkbox__checkmark__path"
            fill="none"
            stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
          />
        </svg>
      </div>
    </div>
    {label && <label>{label}</label>}
  </div>
);

Checkbox.propTypes = {
  disabled: React.PropTypes.bool,
  getRef: React.PropTypes.func,
  label: React.PropTypes.string
};

export default Checkbox;
