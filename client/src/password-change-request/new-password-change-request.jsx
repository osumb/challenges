import React, { Component } from 'react';
import isEmail from 'validator/lib/isEmail';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextFields from '../shared-components/text-fields';

import './new-password-change-request.scss';
import { api } from '../utils';

const request = (instance) => {
  const values = instance.textFields.values();

  instance.setState({
    requesting: true
  });

  api.post('/passwordRequest', values.reduce((acc, curr) => {
    acc[curr.name] = curr.value;

    return acc;
  }, {}))
  .then(() => {
    instance.setState({
      requesting: false,
      success: true
    });
  });
};

const textFields = [
  {
    errorText: 'Please enter your name.#',
    label: 'name.#',
    name: 'nameNumber',
    placeholder: 'name.#',
    style: {
      margin: '10px'
    },
    validate: a => a
  },
  {
    errorText: 'Please enter a valid email',
    label: 'email',
    name: 'email',
    placeholder: 'email',
    style: {
      margin: '10px'
    },
    validate: isEmail
  }
];

export default class NewPasswordChangeRequest extends Component {

  constructor(props) {
    super(props);

    this.state = {
      requesting: false,
      success: false
    };

    this.handleEnter = this.handleEnter.bind(this);
    this.handleSendEmailClick = this.handleSendEmailClick.bind(this);
  }

  handleEnter() {
    this.textFields.validate();
    if (this.textFields.areValid()) {
      request(this);
    }
  }

  handleSendEmailClick() {
    this.textFields.validate();

    if (this.textFields.areValid()) {
      request(this);
    }
  }

  render() {
    const { requesting, success } = this.state;

    if (success) {
      return (
        <div className="NewPasswordChangeRequest">
          <h3>An email has been sent</h3>
          <h3>If it does not appear soon, check your spam folder</h3>
          <Link to="/">Go Home</Link>
        </div>
      );
    }

    return (
      <div className="NewPasswordChangeRequest">
        <h2 className="NewPasswordChangeRequest-text">Need a new password?</h2>
        <h3 className="NewPasswordChangeRequest-text">Enter your name.# and associated email</h3>
        <TextFields
          ref={r => {
            this.textFields = r;
          }}
          onEnter={this.handleEnter}
          textFields={textFields}
        />
        <RaisedButton
          disabled={requesting}
          label="Send email"
          onTouchTap={this.handleSendEmailClick}
          style={{
            marginTop: '10px'
          }}
        />
      </div>
    );
  }
}
