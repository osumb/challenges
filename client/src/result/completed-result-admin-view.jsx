import React, { Component, PropTypes } from 'react';
import { Card, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import './completed-result-admin-view.scss';

export default class CompletedIndividualResult extends Component {

  static get propTypes() {
    return {
      firstComments: PropTypes.string,
      firstName: PropTypes.string,
      firstNameNumber: PropTypes.string,
      id: PropTypes.number,
      performanceDate: PropTypes.string,
      performanceName: PropTypes.string,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string,
      userNameNumber: PropTypes.string.isRequired,
      winnerId: PropTypes.string
    };
  }

  render() {
    const {
      firstComments,
      firstName,
      firstNameNumber,
      performanceName,
      secondComments,
      secondName,
      spotId,
      userNameNumber,
      winnerId
    } = this.props;
    const winnerName = winnerId === firstNameNumber ? firstName : secondName;
    let displayName, userComments;

    if (userNameNumber === firstNameNumber) {
      displayName = firstName;
      userComments = firstComments;
    } else {
      displayName = secondName;
      userComments = secondComments;
    }

    return (
      <Card>
        <h2 className="CompletedResultAdminView-text">{performanceName}</h2>
        <h2 className="CompletedResultAdminView-text">{`${firstName}${secondName ? ` faced ${secondName}` : 'was unchallenged'}`}</h2>
        <h2 className="CompletedResultAdminView-text">{`The spot ${spotId} was being challenged`}</h2>
        <h2 className="CompletedResultAdminView-text">{`${winnerName} won`}</h2>
        <Divider />
        <CardText className="CompletedResultAdminView-comments"><strong>Comments for {displayName}: </strong>{userComments}</CardText>
      </Card>
    );
  }
}
