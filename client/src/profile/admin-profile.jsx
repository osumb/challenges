import React, { PropTypes } from 'react';

import ChallengeWindow from '../performance/challenge-window';
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

const AdminProfile = ({ name, performance }) => (
  <div className="Profile">
    <UserHeader admin name={name} />
    {performance ?
      <ChallengeWindow {...performance} /> :
      <h2>There is no upcoming performance in the system</h2>
    }
    {adminText}
  </div>
);

AdminProfile.propTypes = {
  name: PropTypes.string.isRequired,
  performance: PropTypes.object
};

export default AdminProfile;
