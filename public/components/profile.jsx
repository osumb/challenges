import React, { PropTypes } from 'react';

import './profile.scss';
import ApiWrapper from './api-wrapper';
import ChallengeWindow from './challenge-window';
import Results from './results-for-user';
import UserHeader from './user-header';

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

const renderProfile = ({ admin, name, canChallenge, challenge, performance, results, spotId }) =>
(
  <div className="Profile">
    <UserHeader admin={admin} name={name} spotId={spotId} />
    {performance && <ChallengeWindow {...performance} />}
    {currentChallengeWrapper(canChallenge, challenge && challenge.performanceName, challenge && challenge.spotId)}
    <Results results={results} />
    {admin && adminText}
  </div>
);

renderProfile.propTypes = {
  admin: PropTypes.bool.isRequired,
  canChallenge: PropTypes.bool.isRequired,
  challenge: PropTypes.shape({

  }),
  name: PropTypes.string.isRequired,
  performance: PropTypes.shape({

  }),
  results: PropTypes.arrayOf(PropTypes.shape({

  })),
  spotId: PropTypes.string
};

const Profile = () => (
  <ApiWrapper component={renderProfile} url="/profile" />
);

export default Profile;
