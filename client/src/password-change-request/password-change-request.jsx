import React, { Component, PropTypes } from 'react';
import changeCase from 'change-case';
import keycode from 'keycode';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './password-change-request.scss';
import { api, apiWrapper } from '../utils';

const TEXT_FIELDS = ['password', 'passwordConfirmation'];
const TEXT_FIELD_STATE = TEXT_FIELDS.reduce((acc, curr) => {
  acc[curr] = '';
  acc[`${curr}Error`] = '';

  return acc;
}, {});

class PasswordChangeRequest extends Component {

  static get propTypes() {
    return {
      expires: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      used: PropTypes.bool.isRequired,
      userNameNumber: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      ...TEXT_FIELD_STATE,
      success: false
    };
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleEnterKey({ keyCode }) {
    if (keycode(keyCode) === 'enter') {
      this.handleRequest();
    }

  }

  handleRequest() {
    const { password, passwordConfirmation } = this.state;
    const { id, userNameNumber } = this.props;

    if (password && password === passwordConfirmation) {
      api.put('/passwordRequest', {
        id,
        nameNumber: userNameNumber,
        password
      })
      .then(() => {
        this.setState({
          success: true
        });
      });
    } else {
      this.setState({
        passwordError: password ? '' : 'Please enter a valid password',
        passwordConfirmationError: password && password !== passwordConfirmation ? 'Make sure your passwords match' : ''
      });
    }
  }

  handleTextChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { expires, used } = this.props;
    const { success } = this.state;

    if (used) {
      return (
        <div className="PasswordChangeRequest">
          <h2>Looks like you've already used this link</h2>
          <Link className="PasswordChangeRequest-link" to="/newPassword">Request another</Link>
        </div>
      );
    }

    if (new Date(expires).getTime() < new Date().getTime()) {
      return (
        <div className="PasswordChangeRequest">
          <h2>Sorry, but this link has expired</h2>
          <Link className="PasswordChangeRequest-link" to="/newPassword">Request another</Link>
        </div>
      );
    }

    if (success) {
      return (
        <div className="PasswordChangeRequest">
          <h2>Success! Your password has been changed</h2>
          <Link className="PasswordChangeRequest-link" to="/">Go to login</Link>
        </div>
      );
    }

    return (
      <div className="PasswordChangeRequest">
        <h2>Reset your password</h2>
        <div className="PasswordChangeRequest-inputs">
          {TEXT_FIELDS.map((field) => (
            <div className="PasswordChangeRequest-input" key={field}>
              <TextField
                errorText={this.state[`${field}Error`]}
                key={field}
                onChange={this.handleTextChange}
                onKeyDown={this.handleEnterKey}
                name={field}
                placeholder={changeCase.titleCase(field)}
                type="password"
                value={this.state[field]}
              />
            </div>
          )
          )}
        </div>
        <RaisedButton onTouchTap={this.handleRequest} label="Submit" />
      </div>
    );
  }
}

const PasswordChangeRequestWrapper = ({ location }) => {
  const { Fetch } = apiWrapper;

  if (location.query && location.query.id) {
    return (
      <Fetch
        container={PasswordChangeRequest}
        endPoint="/passwordRequest"
        location={location}
        locationKey="id"
      />
    );
  }

  return (
    <div>
      <h2
        style={{
          textAlign: 'center'
        }}
      >
        Sorry, that is an invalid link
      </h2>
    </div>
  );
};

PasswordChangeRequestWrapper.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default PasswordChangeRequestWrapper;
