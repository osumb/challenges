import React, { Component } from 'react';
import styled from 'styled-components';

import { errorEmitter } from '../../../utils';
import Typography from '../../typography';

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  position: absolute;
  width: 100%;
  z-index: 1;
`;
const Message = styled.div`
  background-color: #ffcdd2;
  border: 1px solid #ff8a80;
  border-radius: 5px;
  display: flex;
  max-width: 50%;
  padding: 5px 10px;
`;
const Text = styled.div`
  flex: 1;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ButtonPadding = styled.div`
  flex: 1;
`;
const Button = styled.button`
  margin-left: 5px;
`;

export default class ErrorBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null
    };
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleErrorEmission = this.handleErrorEmission.bind(this);
  }

  componentDidMount() {
    errorEmitter.on('error', this.handleErrorEmission);
  }

  componentWillUnmount() {
    errorEmitter.removeListener('error', this.handleErrorEmission);
  }

  handleCloseRequest() {
    this.setState({ errorMessage: null });
    errorEmitter.close();
  }

  handleErrorEmission(errorMessage) {
    this.setState({ errorMessage });
  }

  render() {
    const { errorMessage } = this.state;

    return (
      errorMessage && (
        <Container>
          <Message>
            <Text>
              <Typography category="title">{errorMessage}</Typography>
            </Text>
            <ButtonContainer>
              <ButtonPadding />
              <Button onClick={this.handleCloseRequest}>X</Button>
            </ButtonContainer>
          </Message>
        </Container>
      )
    );
  }
}
