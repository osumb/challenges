import React from 'react';
import classNames from 'classnames';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple.min.js';

import './index.scss';

export default class Button extends React.PureComponent {
  componentDidMount() {
    MDCRipple.attachTo(this.button);
  }

  render() {
    const { children, className, onClick, disabled, ...rest } = this.props;
    const classes = classNames({
      [className]: Boolean(className),
      'mdc-button': true,
      'mdc-button--raised': Boolean(rest.raised),
      'mdc-button--dense': Boolean(rest.dense),
      'mdc-button--compact': Boolean(rest.compact),
      'mdc-button--primary': Boolean(rest.primary),
      'mdc-button--accent': Boolean(rest.accent)
    });

    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={onClick}
        ref={ref => {
          this.button = ref;
        }}
        style={{
          color: 'white'
        }}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func
};
