import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { Challenge } from '../../../components/challenge';
import { SideNav, SideNavItem } from '../../../components/side_nav';
import Snackbar from '../../../components/snackbar';
import {
  helpers as challengeHelpers,
  propTypes
} from '../../../data/challenge';
import { helpers as challengeEvaluationHelpers } from '../../../data/challenge_evaluations';
import { fetch } from '../../../utils';
import { FlexChild, FlexContainer } from '../../../components/flex';
import DownloadIcon from '../../../assets/images/ic_file_download_black_24px.svg';
import Typography from '../../../components/typography';

const Download = styled.img``;

const formatString = 'MM/DD/YYYY';
const csvHeader = performance => [
  `Challenge Results For The ${performance.name}`
];
const buildCSV = (performance, challenges) => {
  const csv = ['data:text/csv;charset=utf-8,'];
  const header = csvHeader(performance);
  const challengeHeader = challengeHelpers.csvHeader;

  csv.push(header);
  csv.push([]);
  csv.push(challengeHeader);
  csv.push([]);

  challenges.forEach(challenge => {
    const rows = challengeHelpers.challengeToCSVRows(challenge);

    rows.forEach(row => {
      csv.push(row);
    });

    csv.push([]);
  });

  return csv.join('\n');
};
const forceDownload = csv => {
  const uri = encodeURI(csv);
  const link = document.createElement('a');

  link.setAttribute('href', uri);
  link.setAttribute('download', 'roster.csv');
  document.body.appendChild(link);

  link.click();
  link.remove();
};

class CompletedResults extends React.Component {
  static get propTypes() {
    return propTypes.challengesForEvaluationPropTypes;
  }

  constructor(props) {
    super(props);
    this.getCurrentChallenges = this.getCurrentChallenges.bind(this);
    this.getSortedPerformances = this.getSortedPerformances.bind(this);
    this.handleCommentEdit = this.handleCommentEdit.bind(this);
    this.handleDisappear = this.handleDisappear.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleSaveComments = this.handleSaveComments.bind(this);
    this.setActivePerformanceTo = this.setActivePerformanceTo.bind(this);

    const sortedPerformances = this.getSortedPerformances(props.challenges);
    this.state = {
      challenges: props.challenges,
      currentPerformanceId: sortedPerformances[0] && sortedPerformances[0].id,
      failure: false,
      requesting: false,
      success: false
    };
  }

  getCurrentChallenges() {
    if (!this.state.currentPerformanceId) {
      return [];
    }

    return this.state.challenges.filter(
      challenge => challenge.performance.id === this.state.currentPerformanceId
    );
  }

  getSortedPerformances(challenges = this.state.challenges) {
    const performances = challenges
      .map(challenge => challenge.performance)
      .reduce((acc, val) => {
        if (acc.some(performance => performance.id === val.id)) {
          return acc;
        } else {
          return [...acc, val];
        }
      }, []);

    return performances.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  handleCommentEdit(challengeId) {
    return userChallengeId => event => {
      const target = event.currentTarget;
      this.setState(prevState => {
        const newState = { ...prevState };

        newState.challenges
          .find(challenge => challenge.id === challengeId)
          .userChallenges.find(uc => uc.id === userChallengeId).comments =
          target.value;

        return newState;
      });
    };
  }

  handleDisappear() {
    this.setState({
      failure: false,
      requesting: false,
      success: false
    });
  }

  handleDownloadClick() {
    const currentChallenges = this.getCurrentChallenges();
    const currentPerformance = this.getSortedPerformances().find(
      p => p.id === this.state.currentPerformanceId
    );
    const csv = buildCSV(currentPerformance, currentChallenges);

    forceDownload(csv);
  }

  handleSaveComments(challengeId) {
    return () => {
      this.setState({ requesting: true, success: false, failure: false });
      const challenge = this.state.challenges.find(c => c.id === challengeId);
      challengeEvaluationHelpers
        .putSaveComments(challenge)
        .then(() => {
          this.setState({
            failure: false,
            requesting: false,
            success: true
          });
        })
        .catch(() => {
          this.setState({
            failure: true,
            requesting: false,
            success: false
          });
        });
    };
  }

  setActivePerformanceTo(performanceId) {
    return () => {
      this.setState({
        currentPerformanceId: performanceId
      });
    };
  }

  render() {
    const {
      challenges,
      currentPerformanceId,
      failure,
      requesting,
      success
    } = this.state;
    const sortedPerformances = this.getSortedPerformances();
    const currentChallenges = this.getCurrentChallenges();

    if (challenges.length === 0) {
      return (
        <FlexContainer flexDirection="column" alignItems="center">
          <Typography category="display" number={1}>
            There are no completed Challenges
          </Typography>
        </FlexContainer>
      );
    }

    return (
      <FlexContainer flexDirection="column">
        <FlexContainer flexDirection="row">
          <FlexChild flex="1" />
          <Download src={DownloadIcon} onClick={this.handleDownloadClick} />
        </FlexContainer>
        <FlexContainer>
          <FlexChild flex="0">
            <SideNav>
              {sortedPerformances.map(performance =>
                <SideNavItem
                  active={currentPerformanceId === performance.id}
                  key={performance.id}
                  onClick={this.setActivePerformanceTo(performance.id)}
                  subtitle={`${performance.name}\n${moment(
                    new Date(performance.date)
                  ).format(formatString)}`}
                />
              )}
            </SideNav>
          </FlexChild>
          <FlexChild flex="1">
            <FlexContainer flexDirection="column">
              <FlexContainer justifyContent="center" flexWrap="wrap">
                {currentChallenges.map(({ id, ...rest }) =>
                  <Challenge
                    key={id}
                    id={id}
                    {...rest}
                    hasEditableComments
                    onCommentEdit={this.handleCommentEdit(id)}
                    leftButtonText="Save Comments"
                    onLeftButtonClick={this.handleSaveComments(id)}
                    style={{ margin: 10 }}
                  />
                )}
              </FlexContainer>
              {failure &&
                <Snackbar
                  message="There was a problem saving the comments..."
                  show={failure}
                  onDisappear={this.handleDisappear}
                />}
              {requesting &&
                <Snackbar
                  message="Saving Comments"
                  show={requesting}
                  onDisappear={this.handleDisappear}
                />}
              {success &&
                <Snackbar
                  message="Saved Comments"
                  show={success}
                  onDisappear={this.handleDisappear}
                />}
            </FlexContainer>
          </FlexChild>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

export default fetch(challengeHelpers.getCompleted, null, CompletedResults);
