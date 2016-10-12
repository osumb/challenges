import React from 'react';

import { auth } from '../utils';
const Profile = () => {
  const user = auth.getUser();

  return (
    <div className="Profile">Hey, {user.name}</div>
  );
};

export default Profile;
