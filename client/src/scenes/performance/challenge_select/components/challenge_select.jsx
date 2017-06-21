import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { auth } from '../../../../utils';
import { propTypes as performanceProps } from '../../../../data/performance';
import { helpers as challengeHelpers } from '../../../../data/challenge';
import {
  helpers as userHelpers,
  propTypes as userProps
} from '../../../../data/user';
import { FlexContainer } from '../../../../components/flex';
import Button from '../../../../components/button';
import NormalChallengeableUser from './normal_challengeable_user';
import OpenSpotChallengeableUser from './open_spot_challengeable_user';
import TriChallengeableUser from './tri_challengeable_user';
import Typography from '../../../../components/typography';
import Select from '../../../../components/select';

const ButtonWrapper = styled.div`
  margin-left: 25px;
  margin-top: 10px;
`;
const ErrorText = styled.div`
  color: red;
`;

export default class ChallengeSelect extends React.PureComponent {
  static get propTypes() {
    return {
      challengeableUsers: PropTypes.arrayOf(
        PropTypes.shape(performanceProps.challengeableUser)
      ),
      onChallenge: PropTypes.func,
      performance: PropTypes.shape(performanceProps.performance),
      user: PropTypes.shape(userProps)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      successMessage: null
    };
    this.createChallenge = this.createChallenge.bind(this);
    this.getUser = this.getUser.bind(this);
    this.handleChallengeCreate = this.handleChallengeCreate.bind(this);
    this.handleSelectClick = this.handleSelectClick.bind(this);
  }

  handleChallengeCreate(spot) {
    const spotStr = `${spot.row}${spot.file}`;
    const s = `Successfully challenged ${spotStr} for the ${this.props
      .performance.name}!`;

    this.setState({
      errorMessage: null,
      successMessage: s
    });
    if (this.props.onChallenge) {
      this.props.onChallenge();
    }
  }

  handleSelectClick() {
    const challengeableUser = this.props.challengeableUsers[
      this.select.getSelectedIndex()
    ];

    if (
      challengeableUser === null ||
      typeof challengeableUser === 'undefined'
    ) {
      this.setState({ errorMessage: 'Please select someone to challenge' });
    } else {
      this.createChallenge(challengeableUser);
    }
  }

  createChallenge({ file, row }) {
    const user = this.getUser();

    challengeHelpers
      .create(
        {
          file,
          row
        },
        user.buckId
      )
      .then(({ challenge }) => {
        this.handleChallengeCreate(challenge.spot);
      });
  }

  editCurrentChallenge(challengeableUser) {
    const user = this.getUser();

    challengeHelpers
      .addUser(user.buckId, challengeableUser.challengeId)
      .then(({ challengeSpot }) => {
        this.handleChallengeCreate(challengeSpot);
      });
  }

  getUser() {
    return this.props.user || auth.getUser();
  }

  render() {
    const user = this.getUser();
    const { challengeableUsers, performance } = this.props;
    const { errorMessage, successMessage } = this.state;

    if (successMessage !== null && typeof successMessage !== 'undefined') {
      return (
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography category="display" number={1}>
            {successMessage}
          </Typography>
        </FlexContainer>
      );
    }

    if (challengeableUsers.length <= 0) {
      return (
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography category="display" number={1}>
            Sorry! There is no one for you to challenge at this time
          </Typography>
        </FlexContainer>
      );
    }

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {errorMessage &&
          <ErrorText>
            <Typography category="display" number={2}>
              **{errorMessage}**
            </Typography>
          </ErrorText>}
        <Typography category="display" number={1}>
          Please make a challenge for the {performance.name}
        </Typography>
        <FlexContainer
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Select
            defaultText="Select one person or spot"
            ref={select => {
              this.select = select;
            }}
          >
            {challengeableUsers.map(challengeableUser => {
              if (userHelpers.isTriChallengeUser(user)) {
                return (
                  <TriChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              } else if (challengeableUser.openSpot) {
                return (
                  <OpenSpotChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              } else {
                return (
                  <NormalChallengeableUser
                    key={challengeableUser.buckId}
                    {...challengeableUser}
                  />
                );
              }
            })}
          </Select>
          <ButtonWrapper>
            <Button primary onClick={this.handleSelectClick}>
              Make Challenge
            </Button>
          </ButtonWrapper>
        </FlexContainer>
      </FlexContainer>
    );
  }
}
