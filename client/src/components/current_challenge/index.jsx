import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { propTypes as spotProps } from '../../data/spot';
import { helpers as userChallengeHelpers } from '../../data/user_challenge';
import Button from '../button';
import Confirm from '../confirm';
import Elevation from '../elevation';
import Typography from '../typography';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class CurrentChallenge extends React.PureComponent {
  static get propTypes() {
    return {
      challengeType: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      performanceName: PropTypes.string.isRequired,
      spot: PropTypes.shape(spotProps).isRequired,
      userChallengeId: PropTypes.number
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
      deleted: false
    };
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
  }

  handleDeleteCancel() {
    this.setState({ confirming: false });
  }

  handleDeleteConfirm() {
    const { userChallengeId } = this.props;

    userChallengeHelpers.del(userChallengeId).then(() => {
      this.setState({ confirming: false, deleted: true });
    });
  }

  handleDeleteRequest() {
    this.setState({ confirming: true });
  }

  render() {
    const { confirming, deleted } = this.state;

    if (confirming) {
      return (
        <Confirm
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        >
          <Typography category="title">
            Are you sure you want to delete this challenge?
          </Typography>
        </Confirm>
      );
    }

    if (deleted) {
      return (
        <Elevation>
          <Container>
            <Typography category="headline">
              Successfully deleted challenge!
            </Typography>
          </Container>
        </Elevation>
      );
    }

    return (
      <Elevation>
        <Container>
          <Typography category="headline">
            You're challenging spot {this.props.spot.row}
            {this.props.spot.file} for the {this.props.performanceName}&nbsp;&nbsp;
          </Typography>
          <Button primary onClick={this.handleDeleteRequest}>
            Delete Challenge
          </Button>
        </Container>
      </Elevation>
    );
  }
}
