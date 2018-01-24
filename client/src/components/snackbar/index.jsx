import React from 'react';
import { MDCSnackbar } from '@material/snackbar/dist/mdc.snackbar.min.js';
import PropTypes from 'prop-types';

import { noOp } from '../../utils';

export default class Snackbar extends React.PureComponent {
  static get propTypes() {
    return {
      message: PropTypes.string.isRequired,
      onDisappear: PropTypes.func,
      show: PropTypes.bool.isRequired,
      timeout: PropTypes.number
    };
  }

  constructor(props) {
    super(props);
    this.showSnackbar = this.showSnackbar.bind(this);
  }

  componentDidMount() {
    this.mdcSnackbar = new MDCSnackbar(this.snackbar);
    if (this.props.show) {
      this.showSnackbar();
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.show !== oldProps.show && this.props.show) {
      this.showSnackbar();
    }
  }

  componentWillUnmount() {
    if (this.dismissTimeout) {
      window.clearTimeout(this.dismissTimeout);
    }
  }

  showSnackbar() {
    const timeout = this.props.timeout || 2750;
    const data = {
      timeout,
      actionHandler: noOp,
      actionOnBottom: false,
      actionText: ' ',
      message: this.props.message,
      multiline: false
    };

    this.mdcSnackbar.show(data);
    this.dismissTimeout =
      this.props.onDisappear &&
      window.setTimeout(this.props.onDisappear, timeout);
  }

  render() {
    return (
      <div
        className="mdc-snackbar"
        aria-atomic="true"
        aria-hidden="true"
        aria-live="assertive"
        ref={snackbar => {
          this.snackbar = snackbar;
        }}
      >
        <div className="mdc-snackbar__text">{this.props.message}</div>
        <div className="mdc-snackbar__action-button mdc-snackbar__action-wrapper" />
      </div>
    );
  }
}
