import React from 'react';
import PropTypes from 'prop-types';

import { helpers } from '../../../data/challenge';
import { propTypes } from '../../../data/challenge_evaluations';
import { fetch } from '../../../utils';
import { FlexContainer } from '../../../components/flex';
import Button from '../../../components/button';
import Challenge from './components/challenge';
import Typography from '../../../components/typography';

const { challengeForEvaluationPropTypes } = propTypes;

class ChallengeApproval extends React.Component {
  static get propTypes() {
    return {
      challenges: PropTypes.arrayOf(
        PropTypes.shape(challengeForEvaluationPropTypes)
      ),
      style: PropTypes.object
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      challenges: props.challenges
    };
    this.handleApprove = this.handleApprove.bind(this);
    this.handleApproveAll = this.handleApproveAll.bind(this);
  }

  handleApprove(challengeId) {
    helpers.approve(challengeId).then(() => {
      this.setState(({ challenges }) => ({
        challenges: challenges.filter(({ id }) => id !== challengeId)
      }));
    });
  }

  handleApproveAll() {
    const { challenges } = this.state;
    Promise.all(challenges.map(({ id }) => helpers.approve(id))).then(() => {
      this.setState({
        challenges: []
      });
    });
  }

  render() {
    const { challenges } = this.state;

    if (challenges.length <= 0) {
      return (
        <FlexContainer flexDirection="column" alignItems="center">
          <Typography category="display" number={1}>
            There are no challenges to approve
          </Typography>
        </FlexContainer>
      );
    }

    return (
      <FlexContainer flexDirection="column">
        <Button primary onClick={this.handleApproveAll}>Approve All</Button>
        <FlexContainer justifyContent="center" flexWrap="wrap">
          {challenges.map(({ id, ...rest }) =>
            <Challenge
              key={id}
              id={id}
              {...rest}
              onApprove={this.handleApprove}
              style={{ margin: 10 }}
            />
          )}
        </FlexContainer>
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getForApproval, null, ChallengeApproval);
