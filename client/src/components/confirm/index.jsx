import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from '../button';
import Typography from '../typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;
`;
const ButtonSpacer = styled.div`
  margin: 0 10px;
`;

export default class Confirm extends React.PureComponent {
  static get propTypes() {
    return {
      message: PropTypes.string.isRequired,
      onCancel: PropTypes.func.isRequired,
      onConfirm: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: true
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCloseModal() {
    this.setState({ modalOpen: false });
    this.props.onCancel();
  }

  handleConfirm() {
    this.setState({ modalOpen: false });
    this.props.onConfirm();
  }

  render() {
    return (
      <Modal
        contentLabel="Confirm"
        isOpen={this.state.modalOpen}
        onRequestClose={this.handleCloseModal}
        style={{
          content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }}
      >
        <Container>
          <Typography category="title">{this.props.message}</Typography>
          <ButtonContainer>
            <Button onClick={this.handleCloseModal}>Cancel</Button>
            <ButtonSpacer />
            <Button onClick={this.handleConfirm}>Confirm</Button>
          </ButtonContainer>
        </Container>
      </Modal>
    );
  }
}
