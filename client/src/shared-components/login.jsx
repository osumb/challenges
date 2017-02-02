import React, { Component, PropTypes } from 'react';
import { grey400, grey600 } from 'material-ui/styles/colors';
import keycode from 'keycode';
import { Link, Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { auth } from '../utils';
import './login.scss';

export default class Login extends Component {

  static get propTypes() {
    return {
      location: PropTypes.shape({
        state: PropTypes.object
      }).isRequired
    };
  }

  constructor() {
    super();
    this.state = {
      failed: false,
      invalidNameNumber: false,
      invalidPassword: false,
      nameNumber: '',
      password: '',
      redirectToRefferrer: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    const { nameNumber, password } = this.state;

    this.setState({ failed: false });
    auth.authenticate(nameNumber, password)
    .then(() => {
      this.setState({
        redirectToRefferrer: true
      });
    })
    .catch(() => {
      this.setState({
        failed: true
      });
    });
  }

  handleClick() {
    const { nameNumber, password } = this.state;
    const invalidNameNumber = nameNumber.length <= 0, invalidPassword = password.length <= 0;

    this.setState({
      invalidNameNumber,
      invalidPassword
    });

    if (!invalidNameNumber && !invalidPassword) {
      this.login();
    }
  }

  handleEnterKey({ keyCode }) {
    if (keycode(keyCode) === 'enter') {
      this.handleClick();
    }
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    const { from } = this.props.location.state || '/';

    if (this.state.redirectToRefferrer) {
      return <Redirect to={from || '/'} />;
    }

    return (
      <div className="Login">
        {this.state.failed && <div>Sorry, the username or password is incorrect</div>}
        <div className="Login-inputs">
          <div className="Login-input">
            <TextField
              autoCorrect="off"
              autoCapitalize="off"
              onKeyUp={this.handleEnterKey}
              errorText={this.state.invalidNameNumber && 'This field is required'}
              id="Login-username"
              name="nameNumber"
              onChange={this.handleChange}
              placeholder="name.number"
              underlineFocusStyle={{
                color: grey400
              }}
              value={this.state.nameNumber}
            />
          </div>
          <div className="Login-input">
            <TextField
              autoCorrect="off"
              autoCapitalize="off"
              onKeyUp={this.handleEnterKey}
              errorText={this.state.invalidPassword && 'This field is required'}
              id="Login-password"
              name="password"
              onChange={this.handleChange}
              placeholder="********"
              type="password"
              underlineFocusStyle={{
                color: grey400
              }}
              value={this.state.password}
            />
          </div>
          <div className="Login-input">
            <RaisedButton
              backgroundColor={grey600}
              className="Login-button"
              onTouchTap={this.handleClick}
            >
              Submit
            </RaisedButton>
          </div>
        </div>
        <Link to="/newPassword">Need A New Password?</Link>
      </div>
    );
  }
}
