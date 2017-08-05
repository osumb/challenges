import React from 'react';

import { FlexChild, FlexContainer } from '../../../components/flex';
import { helpers, propTypes } from '../../../data/challenge_evaluations';
import { fetch } from '../../../utils';
import Evaluation from './components/challenge-evaluation';
import SideNav from './components/side-nav';
import SideNavItem from './components/side-nav-item';
import localHelpers from './helpers';

class Evaluations extends React.Component {
  static get propTypes() {
    return propTypes.challengesForEvaluationPropTypes;
  }

  constructor(props, context) {
    super(props, context);

    this.onCommentsChange = this.onCommentsChange.bind(this);
    this.onPlacePick = this.onPlacePick.bind(this);
    this.saveComments = this.saveComments.bind(this);
    this.saveCommentsAndPlaces = this.saveCommentsAndPlaces.bind(this);
    this.savePlaces = this.savePlaces.bind(this);
    this.setActiveChallengeTo = this.setActiveChallengeTo.bind(this);

    const sortedChallenges = localHelpers.sortChallenges(props.challenges);
    const challengesAndUserChallengesById = localHelpers.reduceToKeyedObjects(
      sortedChallenges
    );

    this.state = {
      challenges: challengesAndUserChallengesById,
      currentChallengeId: sortedChallenges[0] && sortedChallenges[0].id
    };
  }

  onCommentsChange(challengeId) {
    return userChallengeId => comments => {
      this.setState(prevState => {
        const newState = { ...prevState };
        newState.challenges[challengeId].userChallenges[
          userChallengeId
        ].comments = comments;
        return newState;
      });
    };
  }

  onPlacePick(challengeId) {
    return userChallengeId => place => {
      this.setState(prevState => {
        const newState = { ...prevState };
        newState.challenges[
          challengeId
        ].userChallenges = localHelpers.switchPlaces(
          newState.challenges[challengeId].userChallenges,
          userChallengeId,
          place
        );
        return newState;
      });
    };
  }

  saveComments(challengeId) {
    const challenge = this.state.challenges[challengeId];
    helpers.postSaveComments(challenge);
  }

  saveCommentsAndPlaces(challengeId) {
    return () => {
      this.saveComments(challengeId);
      this.savePlaces(challengeId);
    };
  }

  savePlaces(challengeId) {
    const challenge = this.state.challenges[challengeId];
    helpers.postSavePlaces(challenge);
  }

  setActiveChallengeTo(challengeId) {
    return () => {
      if (challengeId !== this.state.currentChallengeId) {
        this.saveCommentsAndPlaces(this.state.currentChallengeId)();
        this.setState({
          currentChallengeId: challengeId
        });
      }
    };
  }

  submitForEvaluation(challengeId) {
    return () => {
      const challenge = this.state.challenges[challengeId];
      helpers.putSubmitForEvaluation(challenge).then(() => {
        this.setState(prevState => {
          const newState = { ...prevState };
          delete newState.challenges[challengeId];
          const nextChallenge = localHelpers.sortChallenges(
            Object.values(newState.challenges)
          )[0];
          newState.currentChallengeId = nextChallenge && nextChallenge.id;
          return newState;
        });
      });
    };
  }

  render() {
    const { challenges, currentChallengeId } = this.state;
    const sortedChallenges = localHelpers.sortChallenges(
      Object.values(challenges)
    );
    const currentChallenge = challenges[currentChallengeId];

    return (
      <FlexContainer>
        <FlexChild flex="0">
          <SideNav>
            {sortedChallenges.map(challenge =>
              <SideNavItem
                active={currentChallengeId === challenge.id}
                key={challenge.id}
                onClick={this.setActiveChallengeTo(challenge.id)}
                subtitle={challenge.users
                  .map(user => user.firstName)
                  .join(' vs. ')}
                title={`${challenge.spot.row}${challenge.spot.file}`}
              />
            )}
          </SideNav>
        </FlexChild>
        <FlexChild flex="1">
          <FlexContainer alignItems="center">
            <FlexChild flex="1" margin="auto">
              {currentChallengeId &&
                <Evaluation
                  challenge={currentChallenge}
                  handleSaveCommentsAndPlaces={this.saveCommentsAndPlaces(
                    currentChallengeId
                  )}
                  handleSubmitForEvaluation={this.submitForEvaluation(
                    currentChallengeId
                  )}
                  onCommentsChange={this.onCommentsChange(currentChallenge.id)}
                  onPlacePick={this.onPlacePick(currentChallenge.id)}
                />}
              {!currentChallengeId &&
                <p>Looks like you don't have any challenges to evaluate!</p>}
            </FlexChild>
          </FlexContainer>
        </FlexChild>
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getEvaluableChallenges, null, Evaluations);
