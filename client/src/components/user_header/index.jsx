import React from 'react';
import styled from 'styled-components';
import pick from 'lodash.pick';

import { helpers, propTypes as userPropTypes } from '../../data/user';

const props = ['firstName', 'lastName', 'role', 'currentSpot'];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-bottom: 10px;
`;
const NameHeader = styled.h1`
  align-self: center;
  margin: 0;
  white-space: nowrap;
`;
const AdminTag = styled.h1`
  color: rgb(183, 28, 28);
  margin: 0;
  padding-right: 10px;
`;
const SpotCircle = styled.div`
  background: rgb(183, 28, 28);
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 30px;
  height: 100px;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  width: 100px;
  margin-right: 4px;
`;
const SpotText = styled.h3`align-self: center;`;

const UserHeader = userProps =>
  <Container>
    {helpers.isAdmin(userProps) || helpers.isDirector(userProps)
      ? <AdminTag>Admin</AdminTag>
      : <SpotCircle>
          <SpotText>{`${userProps.currentSpot.row}${userProps.currentSpot
            .file}`}</SpotText>
        </SpotCircle>}
    <NameHeader>
      {`${userProps.firstName} ${userProps.lastName}`}
    </NameHeader>
  </Container>;

UserHeader.propTypes = pick(userPropTypes, [
  'firstName',
  'lastName',
  'role',
  'currentSpot'
]);
UserHeader.props = props;

export default UserHeader;
