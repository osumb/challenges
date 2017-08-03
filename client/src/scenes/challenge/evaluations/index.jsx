import React from 'react';

import { FlexChild, FlexContainer } from '../../../components/flex';
import { helpers } from '../../../data/challenge_evaluations';
import { helpers as spotHelpers } from '../../../data/spot';
import { fetch } from '../../../utils';
import Evaluation from './components/evaluation';
import SideNav from './components/side-nav';
import SideNavItem from './components/side-nav-item';

class Evaluations extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.setActiveChallengeTo = this.setActiveChallengeTo.bind(this);

    let currentChallengeId = null;

    if (props.challenges) {
      const sortedChallenges = props.challenges.sort((a, b) =>
        spotHelpers.compareSpots(a.spot, b.spot)
      );

      currentChallengeId = sortedChallenges[0] && sortedChallenges[0].id
    }

    this.state = {
      currentChallengeId,
    };
  }

  render() {
    if (!this.props.challenges) {
      return null;
    }

    const { challenges } = this.props;
    const { currentChallengeId } = this.state;
    const sortedChallenges = challenges.sort((a, b) => spotHelpers.compareSpots(a.spot, b.spot));
    const currentChallenge = sortedChallenges.find((challenge) => challenge.id === currentChallengeId);

    return (
      <FlexContainer>
        <FlexChild>
          <SideNav>
            {sortedChallenges.map((challenge) => (
              <SideNavItem
                active={currentChallengeId === challenge.id}
                key={challenge.id}
                onClick={this.setActiveChallengeTo(challenge.id)}
                subtitle={challenge.users.map((user) => user.firstName).join(' vs. ')}
                title={`${challenge.spot.row}${challenge.spot.file}`}
              />
            ))}
          </SideNav>
        </FlexChild>
        <FlexChild flex={1}>
          <FlexContainer alignItems="center">
            <FlexChild margin="auto">
              {currentChallengeId && <Evaluation challenge={currentChallenge} />}
              {!currentChallengeId && <p>Looks like you don't have any challenges to evaluate!</p>}
            </FlexChild>
          </FlexContainer>
        </FlexChild>
      </FlexContainer>
    );
  }

  setActiveChallengeTo(challengeId) {
    return () => {
      this.setState({
        currentChallengeId: challengeId,
      });
    };
  }
}

export default fetch(helpers.getEvaluableChallenges, null, Evaluations);
