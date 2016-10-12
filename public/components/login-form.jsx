import React, { Component, PropTypes } from 'react';
import { Redirect } from 'react-router';

import { auth, keyCodes } from '../utils';
import './login-form.scss';

class LoginForm extends Component {

  constructor() {
    super();
    this.state = {
      redirectToRefferrer: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    const { nameNumber, password } = this.refs;

    auth.authenticate(nameNumber.value, password.value)
    .then(() => {
      this.setState({
        ...this.state,
        redirectToRefferrer: true
      });
    });
  }

  handleClick() {
    this.login();
  }

  handleEnterKey({ keyCode }) {
    if (keyCode === keyCodes.ENTER) {
      this.login();
    }
  }

  render() {
    if (this.state.redirectToRefferrer) {
      return <Redirect to={(this.props.location && this.props.location.state) || '/'} />;
    }

    return (
      <div className="LoginForm">
        <div className="LoginForm-inputs">
          <div className="LoginForm-input">
            <label className="LoginForm-inputs-label">Username</label>
            <input
              onKeyUp={this.handleEnterKey}
              placeholder="name.#"
              ref="nameNumber"
              type="text"
              value={this.state.nameNumber}
            />
          </div>
          <div className="LoginForm-input">
            <label className="LoginForm-inputs-label">Password</label>
            <input
              onKeyUp={this.handleEnterKey}
              placeholder="password"
              ref="password"
              type="password"
              value={this.state.password}
            />
          </div>
          <div className="LoginForm-input">
            <button className="LoginForm-button" onClick={this.handleClick}>Submit</button>
          </div>
        </div>
        <div className="LoginForm-forgot">
          <p>Forgot your password?</p>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string
  })
};

export default LoginForm;
