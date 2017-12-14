import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

export default class NameStage extends React.Component {
  static get propTypes() {
    return {
      user: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      }),
      onFormComplete: PropTypes.func.isRequired,
      onFormIncomplete: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName,
      lastName: props.user.lastName
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    if (
      Boolean(this.props.user.firstName) &&
      Boolean(this.props.user.lastName)
    ) {
      this.props.onFormComplete();
    } else {
      this.props.onFormIncomplete();
    }
  }

  componentDidUpdate() {
    if (Boolean(this.state.firstName) && Boolean(this.state.lastName)) {
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
        <Typography category="title">What is their name?</Typography>
        <TextfieldContainer>
          <Textfield
            labelStyle={textfieldStyle}
            hint="First Name"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleTextChange}
          />
          <Textfield
            labelStyle={textfieldStyle}
            hint="Last Name"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleTextChange}
          />
        </TextfieldContainer>
      </Container>
    );
  }
}
