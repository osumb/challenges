import React, { Component, PropTypes } from 'react';

import './profile.scss';
import { api } from '../utils';
import ChallengeWindow from './challenge-window';
import Results from './results';

const adminText = (
  <div>
    <div>
      <h2>Challenges</h2>
      <h4>There, you can create challenges for on behalf of members and see/edit all current challenges</h4>
    </div>
    <div>
      <h2>Performances</h2>
      <h4>There, you can create a new performance, or edit current ones</h4>
    </div>
    <div>
      <h2>Results</h2>
      <h4>There, you can approve results, or edit/view previous results</h4>
    </div>
    <div>
      <h2>Users</h2>
      <h4>There, you can see the current roster or search for users to open spots</h4>
    </div>
  </div>
);

const currentChallengeWrapper = (canChallenge, performanceName, spotId) => {
  if (performanceName && spotId) {
    return (
      <h2 className="CurrentChallenge">You're currently signed up to challenge spot {spotId} for the {performanceName}</h2>
    );
  } else if (canChallenge) {
    return (
      <h2 className="CurrentChallenge">You need to make a challenge! Head to Make A Challenge to do that</h2>
    );
  }
  return null;
};

const profileTitle = (name, spotId, admin) => (
  <div className="Profile-title">
    <div className={admin ? 'Profile-title-admin' : 'Profile-title-spot'}>
      <h1 className="Profile-title-text">
        {spotId || 'Admin'}
      </h1>
    </div>
    <h1 className="Profile-title-name">
      {name}
    </h1>
  </div>
);

class Profile extends Component {

  constructor() {
    super();
    this.state = {
      canChallenge: false,
      challenge: null,
      performance: null,
      results: []
    };
  }

  componentDidMount() {
    api.get('/profile')
    .then(({ canChallenge, challenge, performance, results }) => {
      this.setState({
        canChallenge,
        challenge,
        performance,
        results
      });
    });
  }

  render() {
    const { canChallenge, challenge, performance, results } = this.state;
    const { admin, name, spotId } = this.props.user;

    return (
      <div className="Profile">
        {profileTitle(name, spotId, admin)}
        {performance && <ChallengeWindow {...performance} />}
        {currentChallengeWrapper(canChallenge, challenge && challenge.performanceName, challenge && challenge.spotId)}
        <Results results={results} />
        {admin && adminText}
      </div>
    );
  }
}

Profile.propTypes = {
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

export default Profile;
