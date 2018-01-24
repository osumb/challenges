import React from 'react';

import { FlexChild, FlexContainer } from '../../../components/flex';
import { SideNav, SideNavItem } from '../../../components/side_nav';
import { helpers, propTypes } from '../../../data/challenge_evaluations';
import { errorEmitter, fetch } from '../../../utils';
import CircularProgress from '../../../components/circular_progress';
import Evaluation from './components/challenge-evaluation';
import Typography from '../../../components/typography';
import localHelpers from './helpers';

class Evaluations extends React.Component {
  static get propTypes() {
    return propTypes.challengesForEvaluationPropTypes;
  }

  constructor(props, context) {
    super(props, context);

    this.handleErrorClose = this.handleErrorClose.bind(this);
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
      currentChallengeId: sortedChallenges[0] && sortedChallenges[0].id,
      requesting: false
    };
  }

  componentDidMount() {
    errorEmitter.on('close', this.handleErrorClose);
  }

  componentWillUnmount() {
    errorEmitter.removeListener('close', this.handleErrorClose);
  }

  handleErrorClose() {
    this.setState({
      requesting: false
    });
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
    return helpers.postSaveComments(challenge);
  }

  saveCommentsAndPlaces(challengeId) {
    return () => {
      this.setState({
        requesting: true
      });

      return Promise.all([
        this.saveComments(challengeId),
        this.savePlaces(challengeId)
      ]).then(() => {
        this.setState({
          requesting: false
        });
        return;
      });
    };
  }

  savePlaces(challengeId) {
    const challenge = this.state.challenges[challengeId];
    return helpers.postSavePlaces(challenge);
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
      this.setState({
        requesting: true
      });
      const challenge = this.state.challenges[challengeId];
      this.saveCommentsAndPlaces(challenge.id)().then(() => {
        helpers.putSubmitEvaluation(challenge).then(() => {
          this.setState(prevState => {
            const newState = { ...prevState, requesting: false };
            delete newState.challenges[challengeId];
            const nextChallenge = localHelpers.sortChallenges(
              Object.values(newState.challenges)
            )[0];
            newState.currentChallengeId = nextChallenge && nextChallenge.id;
            return newState;
          });
        });
      });
    };
  }

  render() {
    const { challenges, currentChallengeId, requesting } = this.state;
    const sortedChallenges = localHelpers.sortChallenges(
      Object.values(challenges)
    );
    const currentChallenge = challenges[currentChallengeId];

    if (sortedChallenges.length <= 0) {
      return (
        <Typography
          category="display"
          number={1}
          style={{ textAlign: 'center' }}
        >
          There are no challenges for you to evaluate
        </Typography>
      );
    }
    return (
      <FlexContainer style={{ opacity: requesting ? '0.5' : '1' }}>
        <FlexChild flex="0">
          <SideNav>
            {sortedChallenges.map(challenge => (
              <SideNavItem
                active={currentChallengeId === challenge.id}
                key={challenge.id}
                onClick={this.setActiveChallengeTo(challenge.id)}
                subtitle={challenge.users
                  .map(user => user.firstName)
                  .join(' vs. ')}
                title={`${challenge.spot.row}${challenge.spot.file}`}
              />
            ))}
          </SideNav>
        </FlexChild>
        <FlexChild flex="1">
          <FlexContainer alignItems="center">
            <FlexChild flex="1" margin="auto">
              {currentChallengeId && (
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
                />
              )}
              {!currentChallengeId && (
                <p>Looks like you don't have any challenges to evaluate!</p>
              )}
            </FlexChild>
          </FlexContainer>
        </FlexChild>
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getEvaluableChallenges, null, Evaluations);
