import React, { Component, PropTypes } from 'react';

import './result-for-approval.scss';

class ResultForApproval extends Component {

  constructor() {
    super();
    this.handleApprove = this.handleApprove.bind(this);
  }

  handleApprove() {
    this.props.onApprove(this.props.id);
  }

  render() {
    const {
      firstComments,
      firstName,
      firstNameNumber,
      secondComments,
      secondName,
      spotId,
      winnerId
    } = this.props;

    return (
      <div className="ResultForApproval">
        <div className="ResultForApproval-header">
          <p>{spotId}</p>
          <p className="ResultForApproval-winner">{winnerId === firstNameNumber ? firstName : secondName}</p>
          <div className="ResultForApproval-approveWrapper">
            <button className="ResultForApproval-approve" onClick={this.handleApprove}>Approve</button>
          </div>
        </div>
        <div className="ResultForApproval-comments">
          <div className="ResultForApproval-comments-item">
            <p>{firstName}</p>
            <p>Notes: {firstComments}</p>
          </div>
          {secondComments && secondName &&
            <div className="ResultForApproval-comments-item">
              <p>{secondName}</p>
              <p>Notes: {secondComments}</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

ResultForApproval.propTypes = {
  firstComments: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  firstNameNumber: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onApprove: PropTypes.func.isRequired,
  performanceName: PropTypes.string.isRequired,
  secondComments: PropTypes.string,
  secondName: PropTypes.string,
  secondNameNumber: PropTypes.string,
  spotId: PropTypes.string.isRequired,
  winnerId: PropTypes.string.isRequired
};

export default ResultForApproval;
