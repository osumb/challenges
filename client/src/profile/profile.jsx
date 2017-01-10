import React, { PropTypes } from 'react';

import './profile.scss';
import { apiWrapper } from '../utils';
import AdminProfile from './admin-profile';
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
  admin: PropTypes.bool.isRequired,
  canChallenge: PropTypes.bool.isRequired,
  challenge: PropTypes.object,
  name: PropTypes.string.isRequired,
  performance: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.object),
  spotId: PropTypes.string
};

const Wrapper = apiWrapper(Profile, endPoint);

export default Wrapper;
