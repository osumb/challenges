import React, { Component, PropTypes } from 'react';

import './challenge-select.scss';
import { api } from '../utils';

const select = (challengeableUsers) => {
  const users = challengeableUsers.map(({ name, spotOpen, challengeFull, spotId, challengedCount }) => {
    if (spotOpen && !challengeFull) {
      return (
        <option key={spotId}>
          {spotId} (open - challenged {challengedCount} time(s))
        </option>
      );
    } else if (spotOpen) {
      return (
        <option disabled key={spotId}>
          {spotId} (open - challenged {challengedCount} times(s))
        </option>
      );
    } else if (challengeFull) {
      return (
        <option disabled key={spotId}>
          {spotId}: {name}
        </option>
      );
    } else {
      return (
        <option key={spotId}>
          {spotId}: {name}
        </option>
      );
    }
  });

  return (
    <div className="ChallengeSelect-container">
      <select className="ChallengeSelect-select">
        {users}
      </select>
      <input key="submit" type="submit" className="ChallengeSelect-submit" value="Challenge" />
    </div>
  );
};

class ChallengeSelect extends Component {

  constructor() {
    super();
    this.state = {
      challengeableUsers: null,
      performanceName: null
    };
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

  render() {
    const { challengeableUsers, performanceName } = this.state;

    if (!challengeableUsers) {
      return (
        <div className="ChallengeSelect-loading">
          Loading...
        </div>
      );
    }

    return (
      <div className="ChallengeSelect">
        <h1>Who do you want to challenge for the {performanceName}?</h1>
        {challengeableUsers.length > 0 ?
          select(challengeableUsers) :
            <h2>Sorry, you can't make a challenge right now!</h2>
        }
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
