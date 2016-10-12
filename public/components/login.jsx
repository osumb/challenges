import React, { Component, PropTypes } from 'react';
import { Redirect } from 'react-router';

import { auth, keyCodes } from '../utils';
import './login.scss';

class Login extends Component {

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
      <div className="Login">
        <div className="Login-inputs">
          <div className="Login-input">
            <label className="Login-inputs-label">Username</label>
            <input
              onKeyUp={this.handleEnterKey}
              placeholder="name.#"
              ref="nameNumber"
              type="text"
              value={this.state.nameNumber}
            />
          </div>
          <div className="Login-input">
            <label className="Login-inputs-label">Password</label>
            <input
              onKeyUp={this.handleEnterKey}
              placeholder="password"
              ref="password"
              type="password"
              value={this.state.password}
            />
          </div>
          <div className="Login-input">
            <button className="Login-button" onClick={this.handleClick}>Submit</button>
          </div>
        </div>
        <div className="Login-forgot">
          <p>Forgot your password?</p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string
  })
};

export default Login;
