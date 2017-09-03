import React from 'react';
import PropTypes from 'prop-types';

import { fetch } from '../../../utils';
import { propTypes as challengeProps } from '../../../data/challenge';
import { propTypes as disciplineActionProps } from '../../../data/discipline_action';
import { propTypes as performanceProps } from '../../../data/performance';
import { helpers, propTypes as userProps } from '../../../data/user';
import AdminProfile from './components/admin_profile';
import MemberProfile from './components/member_profile';

const fetchProfile = () => helpers.getProfile();

const Profile = ({
  canChallenge,
  challenges,
  currentChallenge,
  currentDisciplineAction,
  nextPerformance,
  user
}) =>
  helpers.isAdmin(user) || helpers.isDirector(user)
    ? <AdminProfile nextPerformance={nextPerformance} user={user} />
    : <MemberProfile
        canChallenge={canChallenge}
        challenges={challenges}
        currentChallenge={currentChallenge}
        currentDisciplineAction={currentDisciplineAction}
        nextPerformance={nextPerformance}
        user={user}
      />;

Profile.propTypes = {
  canChallenge: PropTypes.bool.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape(challengeProps)),
  currentChallenge: PropTypes.shape(challengeProps),
  currentDisciplineAction: PropTypes.shape(disciplineActionProps),
  nextPerformance: PropTypes.shape(performanceProps.performance),
  user: PropTypes.shape(userProps).isRequired
};

export default fetch(fetchProfile, null, Profile);
