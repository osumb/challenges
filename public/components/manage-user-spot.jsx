import React, { Component, PropTypes } from 'react';

import './manage-user-spot.scss';

class ManageUser extends Component {

  constructor() {
    super();
    this.state = {
      valid: true
    };
    this.handleManage = this.handleManage.bind(this);
  }

  handleManage() {
    const [checkedRefKey] = Object.keys(this.refs).filter((key) => this.refs[key].checked);

    if (!this.props.spotOpen) {
      let reason = '';
      let voluntary = false;

      switch (checkedRefKey) {
      case 'FailedMusicCheck':
        reason = 'Failed Music Check';
        break;
      case 'Voluntary':
        reason = 'Voluntarily Opened Spot';
        voluntary = true;
        break;
      default:
        reason = this.refs.reason.value;
        break;
      }

      if (reason === '') {
        this.setState({
          valid: false
        });
      } else {
        this.props.onManage(this.props.spotId, reason, voluntary, true);
      }
    } else {
      this.props.onManage(this.props.spotId, 'Closed Spot', false, false);
    }
  }

  render() {
    const { spotOpen } = this.props;
    const { valid } = this.state;

    if (spotOpen) {
      return (
        <div className="ManageUserSpot">
          Spot is Open
          <button className="ManageUserSpot-button" onClick={this.handleManage}>Close Spot</button>
        </div>
      );
    } else {
      return (
        <div className="ManageUserSpot">
          {!valid && <p>**Please enter a reason for opening the spot**</p>}
          Spot is closed
          <button className="ManageUserSpot-button" onClick={this.handleManage}>Open Spot</button>
          <p>For What Reason?</p>
          <p>
            <span>Failed Music Check </span>
            <input
              className="IndividualManage-failed"
              defaultChecked
              name="openSpotOptions"
              ref="FailedMusicCheck"
              type="radio"
              value="Failed Music Check"
            />
          </p>
          <p>
            <span>Voluntarily Opened Spot </span>
            <input
              className="IndividualManage-failed"
              name="openSpotOptions"
              ref="Voluntary"
              type="radio"
              value="Voluntary"
            />
          </p>
          <p>
            <span>Other </span>
            <input
              className="IndividualManage-failed"
              name="openSpotOptions"
              ref="Other"
              type="radio"
              value="Other"
            />
            <input className="IndividualManage-reason" placeholder="Discipline reason" ref="reason" />
          </p>
        </div>
      );
    }
  }
}

ManageUser.propTypes = {
  onManage: PropTypes.func.isRequired,
  spotId: PropTypes.string.isRequired,
  spotOpen: PropTypes.bool.isRequired
};

export default ManageUser;
