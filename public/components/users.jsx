import React, { Component } from 'react';

import './users.scss';
import { api } from '../utils';
import UserRow from './user-row';

export default class Users extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      users: null
    };
    this.handlePartEdit = this.handlePartEdit.bind(this);
    this.handleSpotEdit = this.handleSpotEdit.bind(this);
  }

  componentDidMount() {
    api.get('/roster')
    .then(({ users }) => {
      this.setState({
        loading: false,
        users
      });
    });
  }

  handlePartEdit(nameNumber, part) {
    api.put('/users', {
      nameNumber,
      part
    })
    .then(() => {
      const { users } = this.state;

      const user = users.find(({ nameNumber: uNN }) => uNN === nameNumber);

      user.part = part;

      this.setState({
        ...this.state,
        users
      });
    });
  }

  handleSpotEdit(nameNumber, spotId) {
    api.put('/users', {
      nameNumber,
      spotId
    })
    .then(() => {
      const { users } = this.state;

      const user = users.find(({ nameNumber: uNN }) => uNN === nameNumber);

      user.spotId = spotId;

      this.setState({
        ...this.state,
        users
      });
    });
  }

  render() {
    const { loading, users } = this.state;

    if (loading) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="Users">
        {users.map((user, i) =>
          <UserRow
            key={user.nameNumber}
            className={i % 2 === 0 ? 'EvenRow' : 'OddRow'}
            onSpotEdit={this.handleSpotEdit}
            onPartEdit={this.handlePartEdit}
            user={user}
          />
        )}
      </div>
    );
  }
}
