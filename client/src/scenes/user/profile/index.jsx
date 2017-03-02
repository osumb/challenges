import React from 'react';
import pick from 'lodash.pick';

import { fetch, helpers } from '../../../data/user';
import AdminProfile from './components/admin_profile';
import MemberProfile from './components/member_profile';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
  }

  componentDidMount() {
    fetch.byId().then(user => this.setState(user));
  }

  render() {
    const { state: user } = this;

    if (user === null) {
      return <div>Hey</div>;
    }

    return helpers.isAdmin(user) || helpers.isDirector(user)
      ? <AdminProfile {...pick(user, AdminProfile.props)} />
      : <MemberProfile {...pick(user, MemberProfile.props)} />;
  }
}
