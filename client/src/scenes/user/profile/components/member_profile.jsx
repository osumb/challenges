import React from 'react';
import pick from 'lodash.pick';
import styled from 'styled-components';

import { propTypes as userPropTypes } from '../../../../data/user';
import UserHeader from '../../../../components/user_header';

const props = ['firstName', 'lastName', 'role', 'spot'];
const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserProfile = (userProps) => (
  <Container>
    <UserHeader {...pick(userProps, UserHeader.props)} />
  </Container>
);

UserProfile.propTypes = Object.assign({}, pick(userPropTypes, props));
UserProfile.props = props;

export default UserProfile;
