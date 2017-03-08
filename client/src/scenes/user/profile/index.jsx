import React from 'react';

import { fetch, helpers } from '../../../data/user';
import AdminProfile from './components/admin_profile';
import MemberProfile from './components/member_profile';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPerformance: null,
      user: null
    };
  }

  componentDidMount() {
    fetch.profile().then((data) => {
      this.setState(data);
    });
  }

  render() {
    const { nextPerformance, user } = this.state;

    if (user === null) {
      return null;
    }

    return helpers.isAdmin(user) || helpers.isDirector(user)
      ? <AdminProfile nextPerformance={nextPerformance} user={user} />
      : <MemberProfile nextPerformance={nextPerformance} user={user} />;
  }
}
