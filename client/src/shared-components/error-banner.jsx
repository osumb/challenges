import React, { Component } from 'react';

import './error-banner.scss';
import { errorEmitter } from '../utils';

export default class ErrorBanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null
    };
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
  }

  componentDidMount() {
    errorEmitter.on('error', (errorMessage) => {
      this.setState({ errorMessage: null });
      this.setState({ errorMessage });
    });
  }

  handleCloseRequest() {
    this.setState({ errorMessage: null });
  }

  render() {
    const { errorMessage } = this.state;

    return errorMessage && (
      <div className="ErrorBanner">
        <div className="ErrorBanner-message">
          <div className="ErrorBanner-text">
            {errorMessage}
          </div>
          <div className="ErrorBanner-buttonContainer">
            <div className="ErrorBanner-buttonPadding" />
            <button
              className="ErrorBanner-button"
              onTouchTap={this.handleCloseRequest}
            >
              X
            </button>
          </div>
        </div>
      </div>
    );
  }
}
