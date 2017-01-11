import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';

import './search-list-item.scss';

const SearchListItem = ({ name, nameNumber }) => (
  <ListItem className="SearchListItem"
    leftIcon={<PermIdentity />}
    primaryText={<Link className="SearchListItem-link" to={`/users/${nameNumber}`}>{name}</Link>}
  />
);

SearchListItem.propTypes = {
  name: PropTypes.string.isRequired,
  nameNumber: PropTypes.string.isRequired
};

export default SearchListItem;
