import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { api, keyCodes } from '../utils';
import Banner from './banner';

const timeExpired = (time) => new Date().getTime() > new Date(time).getTime();

class ResetPassword extends Component {

  constructor() {
    super();
    this.state = {
      badInput: false,
      loading: true,
      request: null,
      success: false
    };
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { query } = this.props.location;
    const { id } = query;

    if (id) {
      this.request = api.get(`/passwordRequest?id=${id}`);

      this.request.then(({ request }) => {
        this.setState({
          loading: false,
          request
        });
      });
    }
  }

  handleEnterKey({ keyCode }) {
    if (keyCode === keyCodes.ENTER && !this.request) {
      this.handleClick();
    }
  }

  handleClick() {
    const { firstPassword, secondPassword } = this.refs;

    if (firstPassword.value === '' || secondPassword.value === '' || (firstPassword.value !== secondPassword.value)) {
      this.setState({
        ...this.state,
        badInput: true
      });
    } else {
      this.request = api.put('/passwordRequest', {
        id: this.state.request.id,
        nameNumber: this.state.request.userNameNumber,
        password: firstPassword.value
      });

      this.request.then(() => {
        delete this.request;
        this.setState({
          ...this.state,
          success: true
        });
      });
    }
  }

  render() {
    const { badInput, loading, request, success } = this.state;
    const { id } = this.props.location.query;

    if (!id) {
      return (
        <div>
          <h2>Reset Password</h2>
          <h3>There is not enough information in your link</h3>
        </div>
      );
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    if (success) {
      return (
        <div>
          <h2>Your password has been reset!</h2>
          <h3><Link to="/login">Login</Link></h3>
        </div>
      );
    }

    if (request && !timeExpired(request.expires)) {
      return (
        <div className="ForgotPassword">
          {badInput && <Banner message="Please make sure the passwords are the same" />}
          <h3>Reset Your Password</h3>
          <div className="ForgotPassword-inputs">
            <div className="ForgotPassword-input">
              <label className="ForgotPassword-inputs-label">New Password</label>
              <input
                autoCorrect="off"
                autoCapitalize="off"
                autoFocus
                onKeyUp={this.handleEnterKey}
                placeholder="password"
                ref="firstPassword"
                type="password"
              />
            </div>
            <div className="ForgotPassword-input">
              <label className="ForgotPassword-inputs-label">Same Password Again</label>
              <input
                autoCorrect="off"
                autoCapitalize="off"
                onKeyUp={this.handleEnterKey}
                placeholder="password"
                ref="secondPassword"
                type="password"
              />
            </div>
            <div className="ForgotPassword-input">
              <button className="ForgotPassword-button" onClick={this.handleClick}>Submit</button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Sorry, your password request has expired or doesn't exist</h2>
        </div>
      );
    }
  }
}

ResetPassword.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

export default ResetPassword;
