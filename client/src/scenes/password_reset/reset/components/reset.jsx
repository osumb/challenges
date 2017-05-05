import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { helpers as prrHelpers, propTypes } from '../../../../data/password_reset_request';
import { helpers as userHelpers } from '../../../../data/user';
import Button from '../../../../components/button';
import TextField from '../../../../components/textfield';
import Typography from '../../../../components/typography';

const Container = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const TextFieldSpacer = styled.div`
  margin: 20px 0;
`;

export default class PasswordResetReset extends React.PureComponent {
  static get propTypes() {
    return propTypes;
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConf: '',
      success: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleClick() {
    const { password, passwordConf } = this.state;
    const { id, user } = this.props;

    this.setState({ inputErrorMessage: '', success: false });
    if (Boolean(password) && password === passwordConf) {
      userHelpers.resetPassword(id, password, user)
      .then(() => {
        this.setState({ success: true });
      });
    } else {
      let inputErrorMessage = '';

      if (!password) {
        inputErrorMessage = 'Please enter a password';
      } else {
        inputErrorMessage = 'Passwords don\'t match';
      }

      this.setState({ inputErrorMessage });
    }
  }

  handleTextChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { expires, used } = this.props;
    const { inputErrorMessage, success } = this.state;

    if (success) {
      return (
        <Container>
          <Typography category="title">Success! Your password has been reset</Typography>
          <Link to="/login">Login</Link>
        </Container>
      );
    }

    if (used) {
      return (
        <Container>
          <Typography category="title">Sorry! This reset code has already been used</Typography>
          <Link to="/password_reset_requests/new">Request A New One</Link>
        </Container>
      );
    }

    if (prrHelpers.expired(expires)) {
      return (
        <Container><Typography category="title">Sorry! This reset code has already expired</Typography></Container>
      );
    }

    return (
      <Container>
        <Typography category="display" number={1}>Reset Your Password</Typography>
        {inputErrorMessage && <Typography category="subheading" number={2}>**{inputErrorMessage}**</Typography>}
        <TextFieldContainer>
          <TextField
            name="password"
            type="password"
            hint="password"
            onChange={this.handleTextChange}
          />
          <TextFieldSpacer />
          <TextField
            name="passwordConf"
            type="password"
            hint="passwordConfirmation"
            onChange={this.handleTextChange}
          />
          <TextFieldSpacer />
          <Button primary onClick={this.handleClick}>Reset Password</Button>
        </TextFieldContainer>
      </Container>
    );
  }
}
