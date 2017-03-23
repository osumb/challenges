import React from 'react';

import { helpers } from '../../../data/user';
import AdminProfile from './components/admin_profile';
import MemberProfile from './components/member_profile';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canChallenge: null,
      nextPerformance: null,
      user: null
    };
  }

  componentDidMount() {
    helpers.getProfile().then((data) => {
      this.setState(data);
    });
  }

  render() {
    const { canChallenge, currentChallenge, currentDiscipline, nextPerformance, user } = this.state;

    if (user === null) {
      return null;
    }

    return helpers.isAdmin(user) || helpers.isDirector(user)
      ? <AdminProfile nextPerformance={nextPerformance} user={user} />
      : <MemberProfile
          canChallenge={canChallenge}
          currentChallenge={currentChallenge}
          currentDiscipline={currentDiscipline}
          nextPerformance={nextPerformance}
          user={user}
        />;
  }
}
