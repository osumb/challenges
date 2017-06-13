import React from 'react';
import styled from 'styled-components';

import { propTypes as spotProps } from '../../data/spot';
import { helpers as userChallengeHelpers } from '../../data/user_challenge';
import Button from '../button';
import Confirm from '../confirm';
import Elevation from '../elevation';
import Typography from '../typography';

const Container = styled.div`
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
`;

export default class CurrentChallenge extends React.PureComponent {
  static get propTypes() {
    return {
      challengeType: React.PropTypes.string.isRequired,
      id: React.PropTypes.number.isRequired,
      performanceName: React.PropTypes.string.isRequired,
      spot: React.PropTypes.shape(spotProps).isRequired,
      userChallengeId: React.PropTypes.number
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
          message="Are you sure you want to delete this challenge?"
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        />
      );
    }
    return (
      <Elevation zLevel={2}>
        <Container>
          {deleted
            ? <Typography category="headline">
                Successfully deleted challenge!
              </Typography>
            : <Container>
                <Typography category="headline">
                  You're challenging spot {this.props.spot.row}
                  {this.props.spot.file} for the {this.props.performanceName}&nbsp;&nbsp;
                </Typography>
                <Button primary onClick={this.handleDeleteRequest}>
                  Delete Challenge
                </Button>
              </Container>}
        </Container>
      </Elevation>
    );
  }
}
