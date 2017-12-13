import React from 'react';

import PropTypes from 'prop-types';
import Media from 'react-media';

import Button from '../../../../components/button';
import Confirm from '../../../../components/confirm';
import { FlexChild, FlexContainer } from '../../../../components/flex';
import { propTypes } from '../../../../data/challenge_evaluations';
import { screenSizes } from '../../../../utils';
import Typography from '../../../../components/typography';
import UserChallengeEvaluation from './user-challenge-evaluation';

class ChallengeEvaluation extends React.Component {
  static get propTypes() {
    return {
      challenge: PropTypes.shape(
        propTypes.challengeForEvaluationWithUserChallengesObjectPropTypes
      ).isRequired,
      handleSaveCommentsAndPlaces: PropTypes.func.isRequired,
      handleSubmitForEvaluation: PropTypes.func.isRequired,
      onCommentsChange: PropTypes.func.isRequired,
      onPlacePick: PropTypes.func.isRequired
    };
  }

  constructor(props, context) {
    super(props, context);

    this.handleSubmissionCancel = this.handleSubmissionCancel.bind(this);
    this.handleSubmissionConfirm = this.handleSubmissionConfirm.bind(this);
    this.handleSubmissionRequest = this.handleSubmissionRequest.bind(this);
    this.renderEvaluations = this.renderEvaluations.bind(this);

    this.state = {
      confirming: false
    };
  }

  handleSubmissionCancel() {
    this.setState({
      confirming: false
    });
  }

  handleSubmissionConfirm() {
    this.setState({
      confirming: false
    });
    this.props.handleSubmitForEvaluation();
  }

  handleSubmissionRequest() {
    this.setState({
      confirming: true
    });
  }

  renderEvaluations(isPortraitIPad, challenge) {
    if (this.state.confirming) {
      return (
        <Confirm
          onCancel={this.handleSubmissionCancel}
          onConfirm={this.handleSubmissionConfirm}
        >
          <Typography category="title">
            Are you sure you want to submit this challenge for evaluation?
          </Typography>
        </Confirm>
      );
    }

    return (
      <FlexContainer flexDirection="column">
        <FlexContainer
          flexDirection="row"
          justifyContent="space-between"
          margin="0 0 10px 0"
        >
          <Button raised onClick={this.props.handleSaveCommentsAndPlaces}>
            Save
          </Button>
          <Button raised onClick={this.handleSubmissionRequest}>
            Submit for Evaluation
          </Button>
        </FlexContainer>
        <FlexChild flex="0">
          <FlexContainer
            flexDirection={isPortraitIPad ? 'column' : 'row'}
            flexWrap="wrap"
          >
            {Object.values(challenge.userChallenges).map(userChallenge =>
              <FlexChild flex="1" key={userChallenge.id}>
                <UserChallengeEvaluation
                  comments={userChallenge.comments}
                  onCommentsChange={this.props.onCommentsChange(
                    userChallenge.id
                  )}
                  onPlacePick={this.props.onPlacePick(userChallenge.id)}
                  place={userChallenge.place}
                  userChallenge={userChallenge}
                  userCount={challenge.users.length}
                />
              </FlexChild>
            )}
          </FlexContainer>
        </FlexChild>
      </FlexContainer>
    );
  }

  render() {
    return (
      <Media query={{ maxWidth: screenSizes.portraitIPad.width }}>
        {isPortraitIPad =>
          this.renderEvaluations(isPortraitIPad, this.props.challenge)}
      </Media>
    );
  }
}

export default ChallengeEvaluation;
