import React, { PropTypes } from 'react';

import './profile.scss';
import ChallengeWindow from '../performance/challenge-window';
import UserHeader from './user-header';
import Result from '../result/result';

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

const Profile = (props) => {
  const { admin, name, performance, results, spotId } = props;

  return (
    <div className="Profile">
      <UserHeader admin={admin} name={name} spotId={spotId} />
      {admin &&
        <div>
          {performance ?
            <ChallengeWindow {...performance} /> :
            <h2>There is no upcoming performance in the system</h2>
          }
          {adminText}
        </div>
      }
      {results.length > 0 ?
        <div>
          <h2>Results</h2>
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
};

Profile.propTypes = {
  admin: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  performance: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.object),
  spotId: PropTypes.string
};

export default Profile;
