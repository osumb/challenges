import React from 'react';
import PropTypes from 'prop-types';

import { helpers } from '../../../data/challenge';
import { propTypes } from '../../../data/challenge_evaluations';
import { fetch } from '../../../utils';
import { FlexContainer } from '../../../components/flex';
import Button from '../../../components/button';
import Challenge from './components/challenge';
import CircularProgress from '../../../components/circular_progress';
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
      challenges: props.challenges,
      requesting: false
    };
    this.handleApprove = this.handleApprove.bind(this);
    this.handleApproveAll = this.handleApproveAll.bind(this);
    this.handleDisapproval = this.handleDisapproval.bind(this);
  }

  handleApprove(challengeId) {
    this.setState({ requesting: true });
    helpers.approve(challengeId).then(() => {
      this.setState(({ challenges }) => ({
        challenges: challenges.filter(({ id }) => id !== challengeId),
        requesting: false
      }));
    }).catch(() => {
      this.setState({
        requesting: false
      });
    });
  }

  handleDisapproval(challengeId) {
    this.setState({ requesting: true });
    helpers.disapprove(challengeId).then(() => {
      this.setState(({ challenges }) => ({
        challenges: challenges.filter(({ id }) => id !== challengeId),
        requesting: false
      }));
    }).catch(() => {
      this.setState({
        requesting: false
      });
    });
  }

  handleApproveAll() {
    const { challenges } = this.state;

    this.setState({ requesting: true });
    Promise.all(challenges.map(({ id }) => helpers.approve(id))).then(() => {
      this.setState({
        challenges: [],
        requesting: false
      });
    }).catch(() => {
      this.setState({
        requesting: false
      });
    });
  }

  render() {
    const { challenges, requesting } = this.state;

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
              onDisapprove={this.handleDisapproval}
              style={{ margin: 10 }}
            />
          )}
        </FlexContainer>
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getForApproval, null, ChallengeApproval);
