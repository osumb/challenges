import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { propTypes } from '../../../../data/user';
import PermIdentity from '../../../../../public/images/ic_perm_identity_black_36px.svg';

const ListItem = styled.div`
  display: flex;
  align-items: center;
  text-decoration: underline;
`;
const Identity = styled.img`
  margin-right: 10px;
`;

const SearchResultListItem = ({ buckId, firstName, lastName }) =>
  <ListItem>
    <Identity src={PermIdentity} />
    <Link to={`/users/${buckId}`}>{firstName} {lastName}</Link>
  </ListItem>;

SearchResultListItem.propTypes = propTypes;

export default SearchResultListItem;
