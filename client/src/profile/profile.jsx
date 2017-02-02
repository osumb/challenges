import React, { PropTypes } from 'react';

import './profile.scss';
import AdminProfile from './admin-profile';
import Fetch from '../shared-components/fetch';
import UserProfile from './user-profile';

const endPoint = '/profile';

const Profile = (props) => {
  const { admin, name, performance, results, spotId } = props;

  if (admin) {
    return <AdminProfile name={name} performance={performance} />;
  }

  return (
    <UserProfile
      canChallenge={props.canChallenge}
      challenge={props.challenge}
      name={name}
      performance={performance}
      results={results}
      spotId={spotId}
    />
  );
};

Profile.propTypes = {
  admin: PropTypes.bool,
  canChallenge: PropTypes.bool,
  challenge: PropTypes.object,
  name: PropTypes.string,
  performance: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.object),
  spotId: PropTypes.string
};

export default function ProfileContainer(props) {
  return (
    <Fetch
      {...props}
      errorMessage="Error fetching profile"
      endPoint={endPoint}
    >
      <Profile />
    </Fetch>
  );
}
