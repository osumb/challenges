import React from 'react';
import pick from 'lodash.pick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { propTypes as challengeProps } from '../../../../data/challenge';
import { propTypes as disciplineActionProps } from '../../../../data/discipline_action';
import { propTypes as performanceProps } from '../../../../data/performance';
import { propTypes as userProps } from '../../../../data/user';
import CurrentChallenge from '../../../../components/current_challenge';
import { CurrentDisciplineAction } from '../../../../components/discipline_action';
import PerformanceWindow from '../../../../components/performance_window';
import Typography from '../../../../components/typography';
import UserHeader from '../../../../components/user_header';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MemberProfile = props =>
  <Container>
    <UserHeader {...pick(props.user, UserHeader.props)} />
    <PerformanceWindow {...props.nextPerformance} />
    {props.canChallenge &&
      <Typography category="title">
        You still need to make a challenge!
      </Typography>}
    {props.currentChallenge &&
      <CurrentChallenge
        {...props.currentChallenge}
        performanceName={props.nextPerformance.name}
      />}
    {props.currentDisciplineAction &&
      <CurrentDisciplineAction {...props.currentDisciplineAction} />}
  </Container>;

MemberProfile.propTypes = {
  canChallenge: PropTypes.bool.isRequired,
  currentChallenge: PropTypes.shape(challengeProps),
  currentDisciplineAction: PropTypes.shape(disciplineActionProps),
  nextPerformance: PropTypes.shape(performanceProps.performance),
  user: PropTypes.shape(userProps).isRequired
};

export default MemberProfile;
