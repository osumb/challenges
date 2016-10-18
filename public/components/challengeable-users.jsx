import React, { Component, PropTypes } from 'react';

import './challengeable-users.scss';

const getSelectOptionFromChallengeableUser = (challengeableUser) => {
  const { name, spotOpen, challengeFull, spotId, challengedCount } = challengeableUser;

  if (spotOpen && !challengeFull) {
    return (
      <option key={spotId} value={spotId}>
        {spotId} (open - challenged {challengedCount} time(s))
      </option>
    );
  } else if (spotOpen) {
    return (
      <option disabled key={spotId} value={spotId}>
        {spotId} (open - challenged {challengedCount} times(s))
      </option>
    );
  } else if (challengeFull) {
    return (
      <option disabled key={spotId} value={spotId}>
        {spotId}: {name}
      </option>
    );
  } else {
    return (
      <option key={spotId} value={spotId}>
        {spotId}: {name}
      </option>
    );
  }
};

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
          {challengeableUsers.map(getSelectOptionFromChallengeableUser)}
        </select>
        <input key="submit" type="submit" className="ChallengeableUsers-submit" onClick={this.handleClick} value="Challenge" />
      </div>
    );
  }
}

ChallengeableUsers.propTypes = {
  challengeableUsers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    spotOpen: PropTypes.bool.isRequired,
    challengeFull: PropTypes.bool.isRequired,
    spotId: PropTypes.string.isRequired,
    challengedCount: PropTypes.number.isRequired
  })),
  onClick: PropTypes.func.isRequired
};

export default ChallengeableUsers;
