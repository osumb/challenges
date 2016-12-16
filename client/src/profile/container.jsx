import React from 'react';

import ApiWrapper from '../shared-components/api-wrapper';
import Profile from './profile';

const endPoint = '/profile';

const ProfileContainer = () => (
  <ApiWrapper container={Profile} endPoint={endPoint} />
);

export default ProfileContainer;
