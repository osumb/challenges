import React, { Component, PropTypes } from 'react';

import './result-for-approval.scss';
import Result from './result';

class ResultForApproval extends Component {

  constructor() {
    super();
    this.handleApprove = this.handleApprove.bind(this);
  }

  handleApprove() {
    this.props.onApprove(this.props.id);
  }

  render() {
    return (
      <Result {...this.props} button={{ label: 'Approve', handleAction: this.handleApprove }} />
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
