import React from 'react';
import keycode from 'keycode';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import './index.scss';
import { auth, errorEmitter } from '../../utils';
import Button from '../../components/button';
import TextField from '../../components/textfield';
import Typography from '../../components/typography';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
const LoginInputs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const LoginInput = styled.div`
  margin-right: 10px;
`;

export default class Login extends React.PureComponent {

  static get propTypes() {
    return {
      location: React.PropTypes.shape({
        state: React.PropTypes.object
      }).isRequired
    };
  }

  constructor() {
    super();
    this.state = {
      buckId: '',
      password: '',
      redirectToRefferrer: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    const { buckId, password } = this.state;

    this.setState({ failed: false });
    auth.authenticate(buckId, password)
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
    const { buckId, password } = this.state;
    const invalidBuckId = buckId.length <= 0, invalidPassword = password.length <= 0;
    const errs = [];

    if (invalidBuckId) errs.push('name.# must not be blank');
    if (invalidPassword) errs.push('password must not be blank');

    if (!invalidBuckId && !invalidPassword) {
      this.login();
    } else {
      errorEmitter.dispatch(errs.join('; '));
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
      <Container>
        {this.state.failed &&
          <Typography category="display" number={1}>
            Sorry, the username or password is incorrect
          </Typography>
        }
        <LoginInputs className="Login-inputs">
          <LoginInput className="Login-input">
            <TextField
              onKeyUp={this.handleEnterKey}
              name="buckId"
              onChange={this.handleChange}
              hint="name.#"
            />
          </LoginInput>
          <LoginInput className="Login-input">
            <TextField
              onKeyUp={this.handleEnterKey}
              name="password"
              onChange={this.handleChange}
              type="password"
              hint="********"
            />
          </LoginInput>
          <LoginInput className="Login-input">
            <Button onClick={this.handleClick}>Submit</Button>
          </LoginInput>
        </LoginInputs>
        <Link to="/password_reset_requests/new">Need A New Password?</Link>
      </Container>
    );
  }
}
