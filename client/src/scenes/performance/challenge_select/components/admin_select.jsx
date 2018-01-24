import React from 'react';

import { helpers as performanceHelpers } from '../../../../data/performance';
import { helpers as userHelpers } from '../../../../data/user';
import { FlexContainer, FlexChild } from '../../../../components/flex';
import ChallengeSelect from './challenge_select';
import Snackbar from '../../../../components/snackbar';
import Typography from '../../../../components/typography';
import UsersCanChallenge from './users_can_challenge';

export default class AdminSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      challengeableUsersIndex: {},
      challengeCreated: false,
      loadingChallengeableUsers: false,
      selectedSpot: null,
      selectedUserBuckId: null,
      usersWhoCanChallenge: null
    };
    this.handleChallengeCreation = this.handleChallengeCreation.bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
  }

  componentDidMount() {
    userHelpers.getCanChallenge().then(({ users }) => {
      this.setState({ usersWhoCanChallenge: users });
    });
  }

  handleChallengeCreation() {
    const {
      challengeableUsersIndex,
      selectedUserBuckId,
      usersWhoCanChallenge
    } = this.state;
    const newChallengeableUsersIndex = { ...challengeableUsersIndex };
    const newUsersWhoCanChallenge = usersWhoCanChallenge.filter(
      ({ buckId }) => buckId !== selectedUserBuckId
    );

    delete newChallengeableUsersIndex[selectedUserBuckId];

    this.setState({
      challengeableUsersIndex: newChallengeableUsersIndex,
      challengeCreated: true,
      selectedUserBuckId: null,
      usersWhoCanChallenge: newUsersWhoCanChallenge
    });
  }

  handleUserSelect({ buckId }) {
    const usersAlreadyLoaded = this.state.challengeableUsersIndex[buckId];

    this.setState({
      challengeCreated: false,
      loadingChallengeableUsers: !usersAlreadyLoaded,
      selectedUserBuckId: buckId
    });

    if (!usersAlreadyLoaded) {
      performanceHelpers
        .getChallengeableUsers(buckId)
        .then(challengeableUsers => {
          this.setState(({ challengeableUsersIndex }) => ({
            challengeableUsersIndex: {
              ...challengeableUsersIndex,
              [buckId]: challengeableUsers
            },
            loadingChallengeableUsers: false
          }));
        });
    }
  }

  renderChallengeableUsers(state) {
    const {
      challengeableUsersIndex,
      loadingChallengeableUsers,
      selectedUserBuckId,
      usersWhoCanChallenge
    } = state;
    const selectedUser = (usersWhoCanChallenge || []).find(
      ({ buckId }) => buckId === selectedUserBuckId
    );

    if (
      usersWhoCanChallenge.length <= 0 ||
      (!loadingChallengeableUsers && !selectedUserBuckId)
    ) {
      return (
        <Typography category="headline">
          Select a user to make a challenge
        </Typography>
      );
    } else if (loadingChallengeableUsers) {
      return (
        <Typography category="subheading" number={2}>
          Loading users that {selectedUser.firstName} can challenge...
        </Typography>
      );
    } else {
      return (
        <FlexContainer
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Typography category="headline">
            {selectedUser.firstName} {selectedUser.lastName}
          </Typography>
          <ChallengeSelect
            {...challengeableUsersIndex[selectedUserBuckId]}
            headerCategory="headline"
            headerNumber={null}
            onChallenge={this.handleChallengeCreation}
            user={selectedUser}
            style={{
              justifyContent: 'flex-start'
            }}
          />
        </FlexContainer>
      );
    }
  }

  render() {
    const {
      challengeCreated,
      selectedUserBuckId,
      usersWhoCanChallenge
    } = this.state;

    return (
      <FlexContainer justifyContent="center">
        <FlexChild flex={1} padding="0 10px 0 0" textAlign="center">
          {usersWhoCanChallenge === null ? (
            <Typography category="headline">
              Loading users who are elligible to challenge...
            </Typography>
          ) : (
            <UsersCanChallenge
              onSelect={this.handleUserSelect}
              selectedUserBuckId={selectedUserBuckId}
              users={usersWhoCanChallenge}
            />
          )}
        </FlexChild>
        {usersWhoCanChallenge !== null &&
          usersWhoCanChallenge.length > 0 && (
            <FlexChild flex={1} padding="0 10px">
              {this.renderChallengeableUsers(this.state)}
            </FlexChild>
          )}
        <Snackbar show={challengeCreated} message="Created Challenge" />
      </FlexContainer>
    );
  }
}
