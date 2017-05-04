import React from 'react';
import isEmail from 'validator/lib/isEmail';
import keycode from 'keycode';
import styled from 'styled-components';

import { helpers } from '../../../data/password_reset_request';
import Button from '../../../components/button';
import Typography from '../../../components/typography';
import TextField from '../../../components/textfield';

const Container = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TextFieldContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TextFieldSpacer = styled.div`
  margin: 0 10px;
`;

export default class PasswordResetRequest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buckId: '',
      email: '',
      inputErrorMessage: '',
      requestError: false,
      success: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckForEnterKeyUp = this.handleCheckForEnterKeyUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  handleCheckForEnterKeyUp({ keyCode }) {
    if (keycode(keyCode) === 'enter') {
      this.handleClick();
    }
  }

  handleClick() {
    const { buckId, email } = this.state;

    this.setState({
      inputErrorMessage: null,
      requestError: false,
      success: false
    });

    if (isEmail(email) && Boolean(buckId)) {
      helpers.create(buckId, email)
      .then(() => {
        this.setState({ success: true });
      })
      .catch(() => {
        this.setState({ requestError: true });
      });
    } else {
      let inputErrorMessage = '';

      if (!buckId) inputErrorMessage = `${inputErrorMessage}Please enter your name.#.`;
      if (!isEmail(email)) inputErrorMessage = `${inputErrorMessage} Please enter a valid email address.`;

      this.setState({
        inputErrorMessage
      });
    }
  }

  render() {
    const { email, inputErrorMessage, requestError, success } = this.state;

    if (success) {
      return (
        <Container>
          <Typography category="title">Success! An email has been sent to {email} with instructions</Typography>
        </Container>
      );
    }

    return (
      <Container>
        <Typography category="display" number={1}>Need A New Password?</Typography>
        <Typography category="title">Enter Your name.# and email</Typography>
        {inputErrorMessage && <Typography category="subheading" number={2}>**{inputErrorMessage}**</Typography>}
        {requestError && <Typography category="title">Sorry. That name.# and email combination doesn't match. Please try again</Typography>}
        <TextFieldContainer>
          <TextField
            name="buckId"
            onChange={this.handleChange}
            onKeyUp={this.handleCheckForEnterKeyUp}
            hint="name.#"
          />
          <TextFieldSpacer />
          <TextField
            name="email"
            onChange={this.handleChange}
            onKeyUp={this.handleCheckForEnterKeyUp}
            hint="email"
          />
          <TextFieldSpacer />
          <Button primary onClick={this.handleClick}>Submit</Button>
        </TextFieldContainer>
      </Container>
    );
  }
}
