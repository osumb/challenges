import React from 'react';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import styled from 'styled-components';

import { fetch, screenSizes } from '../../../utils';
import {
  helpers as prrHelpers,
  propTypes
} from '../../../data/password_reset_request';
import { helpers as userHelpers } from '../../../data/user';
import Button from '../../../components/button';
import CircularProgress from '../../../components/circular_progress';
import TextField from '../../../components/textfield';
import Typography from '../../../components/typography';

const fetchPRR = ({ match }) => prrHelpers.get(match.params.id);
const Container = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: ${({ requesting }) => (requesting ? 0.5 : 1)};
`;
const TextFieldContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  flex-direction: ${({ direction }) => direction};
`;
const TextFieldSpacer = styled.div`
  margin: 20px;
`;

class PasswordResetReset extends React.PureComponent {
  static get propTypes() {
    return propTypes;
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConf: '',
      requesting: false,
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
      this.setState({ requesting: false });
      userHelpers
        .resetPassword(id, password, user)
        .then(() => {
          this.setState({ requesting: false, success: true });
        })
        .catch(() => {
          this.setState({ requesting: false, success: false });
        });
    } else {
      let inputErrorMessage = '';

      if (!password) {
        inputErrorMessage = 'Please enter a password';
      } else {
        inputErrorMessage = "Passwords don't match";
      }

      this.setState({ inputErrorMessage });
    }
  }

  handleTextChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { expires, used } = this.props;
    const { inputErrorMessage, requesting, success } = this.state;

    if (success) {
      return (
        <Container>
          <Typography category="title">
            Success! Your password has been reset
          </Typography>
          <Link to="/login">Login</Link>
        </Container>
      );
    }

    if (used) {
      return (
        <Container>
          <Typography category="title">
            Sorry! This reset code has already been used
          </Typography>
          <Link to="/password_reset_requests/new">Request A New One</Link>
        </Container>
      );
    }

    if (prrHelpers.expired(expires)) {
      return (
        <Container>
          <Typography category="title">
            Sorry! This reset code has already expired
          </Typography>
        </Container>
      );
    }

    return (
      <Container requesting={requesting}>
        <Typography category="display" number={1}>
          Reset Your Password
        </Typography>
        {inputErrorMessage && (
          <Typography category="subheading" number={2}>
            **{inputErrorMessage}**
          </Typography>
        )}
        <Media query={{ minWidth: screenSizes.landscapeIPhone5.width }}>
          {matches => (
            <TextFieldContainer direction={matches ? 'row' : 'column'}>
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
              <Button primary onClick={this.handleClick} disabled={requesting}>
                Reset Password
              </Button>
            </TextFieldContainer>
          )}
        </Media>
        {requesting && <CircularProgress />}
      </Container>
    );
  }
}

export default fetch(fetchPRR, null, PasswordResetReset);
