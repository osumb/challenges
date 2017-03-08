import React from 'react';
import pick from 'lodash.pick';
import styled from 'styled-components';

import { propTypes as performancePropTypes } from '../../../../data/performance';
import { propTypes as userPropTypes } from '../../../../data/user';
import PerformanceWindow from '../../../../components/performance_window';
import UserHeader from '../../../../components/user_header';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MemberProfile = (props) => {
  return (
    <Container>
      <UserHeader {...pick(props.user, UserHeader.props)} />
      <PerformanceWindow {...props.nextPerformance} />
    </Container>
  );
};

MemberProfile.propTypes = {
  nextPerformance: React.PropTypes.shape(performancePropTypes),
  user: React.PropTypes.shape(userPropTypes).isRequired
};

export default MemberProfile;
