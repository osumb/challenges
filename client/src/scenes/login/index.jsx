import React from 'react';
import keycode from 'keycode';
import { Link, Redirect } from 'react-router-dom';
import Media from 'react-media';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { auth, errorEmitter, screenSizes } from '../../utils';
import Button from '../../components/button';
import CircularProgress from '../../components/circular_progress';
import TextField from '../../components/textfield';
import Typography from '../../components/typography';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  opacity: ${({ requesting }) => (requesting ? 0.5 : 1)}
`;
const LoginInputs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: ${({ flexDirection }) => flexDirection};
`;
const LoginInput = styled.div`
  margin-right: 10px;
  margin-bottom: ${({ mBottom }) => mBottom || '0'};
`;

export default class Login extends React.PureComponent {
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
      buckId: '',
      password: '',
      redirectToRefferrer: false,
      requesting: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    const { buckId, password } = this.state;

    this.setState({ failed: false, requesting: true });
    auth
      .authenticate(buckId, password)
      .then(() => {
        this.setState({
          redirectToRefferrer: true
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          failed: true,
          requesting: false
        });
      });
  }

  handleClick() {
    const { buckId, password } = this.state;
    const invalidBuckId = buckId.length <= 0,
      invalidPassword = password.length <= 0;
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
    const { from = '' } = this.props.location.state;
    const { requesting } = this.state;

    if (this.state.redirectToRefferrer) {
      return <Redirect to={from || '/'} />;
    }

    return (
      <Container requesting={requesting}>
        {this.state.failed &&
          <Typography category="display" number={1}>
            Sorry, the username or password is incorrect
          </Typography>}
        <Media query={{ minWidth: screenSizes.landscapeIPhone5.width }}>
          {matches =>
            <LoginInputs
              className="Login-inputs"
              flexDirection={matches ? 'row' : 'column'}
            >
              <LoginInput mBottom={!matches && '10px'}>
                <TextField
                  onKeyUp={this.handleEnterKey}
                  name="buckId"
                  onChange={this.handleChange}
                  hint="name.#"
                />
              </LoginInput>
              <LoginInput mBottom={!matches && '10px'}>
                <TextField
                  onKeyUp={this.handleEnterKey}
                  name="password"
                  onChange={this.handleChange}
                  type="password"
                  hint="********"
                />
              </LoginInput>
              <LoginInput mBottom={!matches && '10px'}>
                <Button onClick={this.handleClick} disabled={requesting}>
                  Submit
                </Button>
              </LoginInput>
              {requesting && <CircularProgress />}
            </LoginInputs>}
        </Media>
        <Link to="/password_reset_requests/new">Need A New Password?</Link>
      </Container>
    );
  }
}
