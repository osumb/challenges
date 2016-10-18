import React, { Component, PropTypes } from 'react';

import './challenge-select.scss';
import { api } from '../utils';
import ChallengeableUsers from './challengeable-users';

class ChallengeSelect extends Component {

  constructor() {
    super();
    this.state = {
      challengeableUsers: null,
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
        performanceName
      });
    });
  }

  handleClick(spotId) {
    api.post('/challenges/create', {
      spotId
    })
    .then(() => {
      this.setState({
        ...this.state,
        selectedSpot: spotId
      });
    });
  }

  render() {
    const { challengeableUsers, performanceName, selectedSpot } = this.state;

    if (selectedSpot) {
      return (
        <h2>Successfully challenged for {selectedSpot}</h2>
      );
    }

    if (!challengeableUsers) {
      return (
        <div className="ChallengeSelect-loading">
          Loading...
        </div>
      );
    }

    return (
      <div className="ChallengeSelect">
        {performanceName && challengeableUsers.length > 0 && <h1>Who do you want to challenge for the {performanceName}?</h1>}
        {<ChallengeableUsers challengeableUsers={challengeableUsers} onClick={this.handleClick} />}
      </div>
    );
  }
}

ChallengeSelect.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool.isRequired,
    director: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    instrument: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameNumber: PropTypes.string.isRequired,
    new: PropTypes.bool.isRequired,
    part: PropTypes.string.isRequired,
    spotId: PropTypes.string,
    spotOpen: PropTypes.bool,
    squadLeader: PropTypes.bool
  })
};

export default ChallengeSelect;
