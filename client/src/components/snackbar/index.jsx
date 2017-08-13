import React from 'react';
import { MDCSnackbar } from '@material/snackbar/dist/mdc.snackbar.min.js';
import PropTypes from 'prop-types';

import { noOp } from '../../utils';

export default class Snackbar extends React.PureComponent {
  static get propTypes() {
    return {
      message: PropTypes.string.isRequired,
      show: PropTypes.bool.isRequired
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

  showSnackbar() {
    const data = {
      actionHandler: noOp,
      actionOnBottom: false,
      actionText: ' ',
      message: this.props.message,
      multiline: false
    };

    this.mdcSnackbar.show(data);
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
        <div className="mdc-snackbar__text">
          {this.props.message}
        </div>
        <div className="mdc-snackbar__action-button mdc-snackbar__action-wrapper" />
      </div>
    );
  }
}
