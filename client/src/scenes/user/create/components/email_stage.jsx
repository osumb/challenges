import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmail from 'validator/lib/isEmail';

import Textfield from '../../../../components/textfield';
import Typography from '../../../../components/typography';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TextfieldContainer = styled.div`
  display: flex;
`;
const textfieldStyle = {
  margin: '4px'
};

const isFormComplete = (buckId, email) => Boolean(buckId) && isEmail(email);

export default class EmailStage extends React.Component {
  static get propTypes() {
    return {
      user: PropTypes.shape({
        buckId: PropTypes.string,
        email: PropTypes.string
      }),
      onFormComplete: PropTypes.func.isRequired,
      onFormIncomplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      buckId: props.user.buckId,
      email: props.user.email
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    if (isFormComplete(this.props.user.buckId, this.props.user.email)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  componentDidUpdate() {
    if (isFormComplete(this.state.buckId, this.state.email)) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  handleTextChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <Container>
        <Typography category="title">What is their dot number and email?</Typography>
        <TextfieldContainer>
          <Textfield labelStyle={textfieldStyle} hint="Name.#" name="buckId" value={this.state.buckId} onChange={this.handleTextChange} />
          <Textfield labelStyle={textfieldStyle} hint="Email" name="email" value={this.state.email} onChange={this.handleTextChange} />
        </TextfieldContainer>
      </Container>
    );
  }
}
