import React, { Component } from 'react';

import './challenge-select.scss';
import { api } from '../utils';
import ChallengeableUsers from './challengeable-users';

class ChallengeSelect extends Component {

  constructor() {
    super();
    this.state = {
      code: null,
      challengeableUsers: null,
      loading: true,
      performanceName: null,
      selectedSpot: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    api.get('/challengeableUsers')
    .then(({ challengeableUsers, performanceName }) => {
      this.setState({
        challengeableUsers,
        loading: false,
        performanceName
      });
    });
  }

  handleClick(spotId) {
    api.post('/challenges/create', {
      spotId
    })
    .then(({ code }) => {
      if (!code) {
        this.setState({
          ...this.state,
          code: null,
          selectedSpot: spotId
        });
      } else {
        this.setState({
          ...this.state,
          code
        });
      }
    });
  }

  render() {
    const { challengeableUsers, code, loading, performanceName, selectedSpot } = this.state;

    if (loading) {
      return (
        <div className="ChallengeSelect-loading">
          Loading...
        </div>
      );
    }

    if (selectedSpot) {
      return (
        <h2>Successfully challenged for {selectedSpot}!</h2>
      );
    }

    if (code === 2) {
      return (
        <h2>You've already made a challenge</h2>
      );
    }

    return (
      <div className="ChallengeSelect">
        {performanceName && challengeableUsers.length > 0 && <h1>Who do you want to challenge for the {performanceName}?</h1>}
        {code === 1 && <h2>Sorry! That person was already challenged. Please pick another person</h2>}
        {<ChallengeableUsers challengeableUsers={challengeableUsers} onClick={this.handleClick} />}
      </div>
    );
  }
}

export default ChallengeSelect;
