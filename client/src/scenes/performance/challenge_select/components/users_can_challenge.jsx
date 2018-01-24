/* eslint-disable react/jsx-no-bind */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { List, ListItem } from '../../../../components/list';
import Textfield from '../../../../components/textfield';
import Typography from '../../../../components/typography';

const userFilter = (filter, { firstName, lastName }) => {
  const lower = filter.toLowerCase();

  return (
    firstName.toLowerCase().includes(lower) ||
    lastName.toLowerCase().includes(lower)
  );
};

const ListContainer = styled.div`
  height: 520px;
  overflow: scroll;
`;
const UserContainer = styled.div`
  width: 100%;
  &:hover {
    background-color: #f3f3f3;
    cursor: pointer;
  }
`;

export default class UsersCanChallenge extends React.PureComponent {
  static get propTypes() {
    return {
      onSelect: PropTypes.func.isRequired,
      selectedUserBuckId: PropTypes.string,
      users: PropTypes.arrayOf(PropTypes.object).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { onSelect, selectedUserBuckId, users } = this.props;
    const { filter } = this.state;
    const filteredUsers = users.filter(userFilter.bind(null, filter));

    if (users.length > 0) {
      return (
        <div>
          <Textfield
            placeholder="Filter users"
            value={filter}
            onChange={this.handleFilterChange}
            name="filter"
            labelStyle={{
              margin: 0,
              width: '100%'
            }}
          />
          <ListContainer>
            <List>
              {filteredUsers.map(user => (
                <UserContainer
                  key={user.buckId}
                  onClick={onSelect.bind(null, user)}
                  selected={selectedUserBuckId === user.buckId}
                >
                  <ListItem>
                    <Typography category="subheading" number={2}>
                      <b>
                        {user.firstName} {user.lastName}
                      </b>
                      &nbsp;({user.currentSpot.row}
                      {user.currentSpot.file})
                    </Typography>
                  </ListItem>
                </UserContainer>
              ))}
            </List>
          </ListContainer>
        </div>
      );
    }
    return (
      <Typography category="display" number={2}>
        No users are currently elligible to make a challenge
      </Typography>
    );
  }
}
