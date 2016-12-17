import React, { PropTypes } from 'react';

import ChallengeWindow from '../performance/challenge-window';
import CurrentChallenge from '../challenge/current-challenge';
import Result from '../result/result';
import UserHeader from './user-header';

const UserProfile = ({ canChallenge, challenge, name, performance, results, spotId }) => (
  <div className="Profile">
    <UserHeader admin={false} name={name} spotId={spotId} />
    {performance && <ChallengeWindow {...performance} />}
    {canChallenge ?
      <h2>You still need to make a challenge!</h2> :
      <CurrentChallenge {...challenge} />
    }
    {results.length > 0 ?
      <div>
        <h2>Previous Results</h2>
        <div className="Profile-results">
          {results.map(({ id, ...rest }) => {
            return <Result key={id} forProfile id={id} {...rest} />;
          })}
        </div>
      </div> :
      <h2>You have no previous challenge results</h2>
    }
  </div>
);

UserProfile.propTypes = {
  canChallenge: PropTypes.bool.isRequired,
  challenge: PropTypes.shape({
    name: PropTypes.string.isRequired,
    spotId: PropTypes.string.isRequired
  }),
  name: PropTypes.string.isRequired,
  performance: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.object),
  spotId: PropTypes.string.isRequired
};

export default UserProfile;
