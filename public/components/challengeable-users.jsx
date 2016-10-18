import React, { Component, PropTypes } from 'react';

import './challengeable-users.scss';
import ChallengeableUser from './challengeable-user';

class ChallengeableUsers extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.refs.select.value);
  }

  render() {
    const { challengeableUsers } = this.props;

    if (challengeableUsers.length <= 0) return <h2>Sorry! You can't make a challenge right now</h2>;

    return (
      <div className="ChallengeableUsers">
        <select className="ChallengeableUsers-select" ref="select">
          {challengeableUsers.map((cUser) => <ChallengeableUser key={cUser.spotId} {...cUser} />)}
        </select>
        <input key="submit" type="submit" className="ChallengeableUsers-submit" onClick={this.handleClick} value="Challenge" />
      </div>
    );
  }
}

ChallengeableUsers.propTypes = {
  challengeableUsers: PropTypes.arrayOf(PropTypes.shape({
    challengeFull: PropTypes.bool.isRequired,
    challengedCount: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    spotId: PropTypes.string.isRequired,
    spotOpen: PropTypes.bool.isRequired
  })),
  onClick: PropTypes.func.isRequired
};

export default ChallengeableUsers;
