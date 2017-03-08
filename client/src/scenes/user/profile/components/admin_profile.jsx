import React from 'react';
import pick from 'lodash.pick';
import styled from 'styled-components';

import { propTypes as userPropTypes } from '../../../../data/user';
import { propTypes as performancePropTypes } from '../../../../data/performance';
import PerformanceWindow from '../../../../components/performance_window';
import UserHeader from '../../../../components/user_header';

const adminText = (
  <div>
    <div>
      <h2>Challenges</h2>
      <h4>There, you can create challenges for on behalf of members and see/edit all current challenges</h4>
    </div>
    <div>
      <h2>Performances</h2>
      <h4>There, you can create a new performance, or edit current ones</h4>
    </div>
    <div>
      <h2>Users</h2>
      <h4>There, you can see the current roster or search for users to open spots</h4>
    </div>
  </div>
);

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AdminProfile = (props) => (
  <Container>
    <UserHeader {...pick(props.user, UserHeader.props)} />
    <PerformanceWindow {...props.nextPerformance} />
    {adminText}
  </Container>
);

AdminProfile.propTypes = {
  nextPerformance: React.PropTypes.shape(performancePropTypes),
  user: React.PropTypes.shape(userPropTypes).isRequired
};

export default AdminProfile;
