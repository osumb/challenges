import React, { Component } from 'react';

import './forgot-password.scss';
import { api, keyCodes } from '../utils';
import Banner from './banner';

export default class ForgotPassword extends Component {

  constructor() {
    super();
    this.state = {
      badInput: false,
      email: '',
      emailSent: false
    };
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleEnterKey({ keyCode }) {
    if (keyCode === keyCodes.ENTER && !this.request) {
      this.handleClick();
    }
  }

  handleClick() {
    const { email, nameNumber } = this.refs;

    if (email.value === '' || nameNumber.value === '') {
      this.setState({
        ...this.state,
        badInput: true
      });
    } else {
      this.request = api.post('/passwordRequest', {
        email: email.value,
        nameNumber: nameNumber.value
      });

      this.request.then(() => {
        delete this.request;
        this.setState({
          email: email.value,
          emailSent: true
        });

      });
    }
  }

  render() {
    const { badInput, email, emailSent } = this.state;

    if (emailSent) {
      return <div>A recovery email has been sent to {email}</div>;
    }

    return (
      <div className="ForgotPassword">
        {badInput && <Banner message="Please enter both your dot number and email" />}
        <h3>Enter your name.number and email to recover your email</h3>
        <div className="ForgotPassword-inputs">
          <div className="ForgotPassword-input">
            <label className="ForgotPassword-inputs-label">name.#</label>
            <input
              autoCorrect="off"
              autoCapitalize="off"
              onKeyUp={this.handleEnterKey}
              placeholder="name.#"
              ref="nameNumber"
              type="text"
            />
          </div>
          <div className="ForgotPassword-input">
            <label className="ForgotPassword-inputs-label">Email</label>
            <input
              autoCorrect="off"
              autoCapitalize="off"
              onKeyUp={this.handleEnterKey}
              placeholder="email"
              ref="email"
              type="text"
            />
          </div>
          <div className="ForgotPassword-input">
            <button className="ForgotPassword-button" onClick={this.handleClick}>Send Email</button>
          </div>
        </div>
      </div>
    );
  }
}
