import React from 'react';

import { auth, compareSpots, fetch } from '../../../utils';
import { helpers as performanceHelpers } from '../../../data/performance';
import { helpers as userHelpers } from '../../../data/user';
import AdminSelect from './components/admin_select';
import Select from './components/challenge_select';

const fetchChallengeableUsers = () =>
  performanceHelpers.getChallengeableUsers();
const propsFromData = ({ challengeableUsers, performance }) => ({
  challengeableUsers: [...challengeableUsers].sort(compareSpots),
  performance
});

const MemberSelect = fetch(fetchChallengeableUsers, propsFromData, Select);

const ChallengeSelect = () =>
  userHelpers.isAdmin(auth.getUser()) ? <AdminSelect /> : <MemberSelect />;

export default ChallengeSelect;
