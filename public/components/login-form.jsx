import React, { Component, PropTypes } from 'react';

import './login-form.scss';

class LoginForm extends Component {

  constructor() {
    super();
    this.state = {
      nameNumber: '',
      password: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleNameNumberChange = this.handleNameNumberChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleClick() {
    this.props.onLogin(this.state.nameNumber, this.state.password);
  }

  handleNameNumberChange({ target }) {
    this.setState({
      ...this.state,
      nameNumber: target.value
    });
  }

  handlePasswordChange({ target }) {
    this.setState({
      ...this.state,
      password: target.value
    });
  }

  render() {
    return (
      <div className="LoginForm">
        <div className="LoginForm-inputs">
          <div className="LoginForm-input">
            <label className="LoginForm-inputs-label">Username</label>
            <input
              onChange={this.handleNameNumberChange}
              placeholder="name.#"
              type="text"
              value={this.state.nameNumber}
            />
          </div>
          <div className="LoginForm-input">
            <label className="LoginForm-inputs-label">Password</label>
            <input
              onChange={this.handlePasswordChange}
              placeholder="password"
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
  onLogin: PropTypes.func.isRequired
};

export default LoginForm;
