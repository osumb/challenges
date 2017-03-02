import React from 'react';
import styled from 'styled-components';
import pick from 'lodash.pick';

import { helpers, propTypes as userPropTypes } from '../../data/user';

const props = ['firstName', 'lastName', 'role', 'spot'];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding-top: 10px;
`;

const NameHeader = styled.h1`
  align-self: center;
  padding-left: 10px;
`;

const AdminTag = styled.h1`
  color: rgb(183, 28, 28);
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
`;

const SpotText = styled.h3`
  align-self: center;
`;

const UserHeader = (userProps) => (
  <Container>
    {helpers.isAdmin(userProps) || helpers.isDirector(userProps)
      ? <AdminTag>Admin</AdminTag>
      : <SpotCircle><SpotText>{`${userProps.spot.row}${userProps.spot.file}`}</SpotText></SpotCircle>
    }
    <NameHeader>
      {`${userProps.firstName} ${userProps.lastName}`}
    </NameHeader>
  </Container>
);

UserHeader.propTypes = pick(userPropTypes, ['firstName', 'lastName', 'role', 'spot']);
UserHeader.props = props;

export default UserHeader;
