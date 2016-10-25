import React, { Component, PropTypes } from 'react';

import { api } from '../utils';
import Challenge from './challenge';
import ManageAction from './manage-action';
import ManageUserSpot from './manage-user-spot';
import ResultsForUser from './results-for-user';
import UserHeader from './user-header';

const getProfileInfo = (nameNumber) =>
  api.get(`/users/profile?nameNumber=${nameNumber}`);

class User extends Component {

  constructor() {
    super();
    this.state = {
      challenges: null,
      loading: true,
      manages: null,
      performance: null,
      results: null,
      spot: null,
      user: null
    };
    this.handleManage = this.handleManage.bind(this);
  }

  componentDidMount() {
    const { nameNumber } = this.props.params;

    getProfileInfo(nameNumber)
    .then((profileInfo) => {
      this.setState({
        ...profileInfo,
        loading: false
      });
    });
  }

  handleManage(spotId, reason, voluntary, spotOpen) {
    api.post('/users/manage', {
      performanceId: this.state.performance.id,
      nameNumber: this.state.user.nameNumber,
      reason,
      spotId,
      spotOpen,
      voluntary
    }).then(() => {
      getProfileInfo(this.state.user.nameNumber)
      .then((profileInfo) => {
        this.setState({
          ...profileInfo
        });
      });
    });
  }

  render() {
    const { challenges, loading, manages, performance, results, spot, user } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="User">
        <UserHeader admin={user.admin} name={user.name} spotId={spot.id} />
        <h2>Manage</h2>
        {performance === null ?
          <h2>There is no upcoming performance in the system, so no manage action can be made</h2> :
            <ManageUserSpot onManage={this.handleManage} spotId={spot.id} spotOpen={spot.open} />
        }
        {manages.length > 0 ?
          <div>
            <h3>Previous Action Items</h3>
            {manages.map(({ id, ...rest }) => <ManageAction key={id} {...rest} />)}
          </div> :
            <h3>Not previous actions have been made for this user</h3>
        }
        <hr />
        <h2>Previous Challenges</h2>
        {challenges.map(({ id, ...rest }) => <Challenge {...rest} key={id} owner={false} />)}
        <hr />
        <h2>Previous Results</h2>
        <ResultsForUser results={results} />
      </div>
    );
  }
}

User.propTypes = {
  params: PropTypes.shape({
    nameNumber: PropTypes.string.isRequired
  })
};

export default User;
