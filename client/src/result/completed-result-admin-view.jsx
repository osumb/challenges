import React, { Component,} from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './completed-result-admin-view.scss';

export default class CompletedIndividualResult extends Component {
  static get propTypes() {
    return {
      firstComments: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      firstNameNumber: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      performanceDate: PropTypes.string.isRequired,
      performanceName: PropTypes.string.isRequired,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string.isRequired,
      userNameNumber: PropTypes.string.isRequired,
      winnerId: PropTypes.string.isRequired
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
    const textDivPadding = '0 16px';
    const leftNameClass = classnames({
      'CompletedResultAdminView-text--left': true,
      'CompletedResultAdminView-text--winner': winnerId === firstNameNumber
    });
    const rightNameClass = classnames({
      'CompletedResultAdminView-text--right': true,
      'CompletedResultAdminView-text--winner': winnerId !== firstNameNumber
    });
    const winnerMarkerClass = classnames({
      'CompletedResultAdminView-winnerMarker--left':
        winnerId === firstNameNumber,
      'CompletedResultAdminView-winnerMarker--right':
        winnerId !== firstNameNumber
    });

    let displayName, userComments;

    if (userNameNumber === firstNameNumber) {
      displayName = firstName;
      userComments = firstComments;
    } else {
      displayName = secondName;
      userComments = secondComments;
    }

    return (
      <Card style={{ margin: '10px' }}>
        <CardTitle title={performanceName} subtitle={spotId} />
        <div className="CompletedResultAdminView-text--wrapper">
          <h3 className={leftNameClass}>
            {firstName}
          </h3>
          {secondName &&
            <h3 className="CompletedResultAdminView-text--center">vs</h3>}
          {secondName &&
            <h3 className={rightNameClass}>
              {secondName}
            </h3>}
        </div>
        <div className="CompletedResultAdminView-winnerMarker--wrapper">
          <p className={winnerMarkerClass}>*Winner</p>
        </div>
        <h3 className="CompletedResultAdminView-text">
          {`${displayName.split(' ')[0]}'s`} comments:{' '}
        </h3>
        <CardText style={{ fontSize: '18px', padding: textDivPadding }}>
          {userComments}
        </CardText>
      </Card>
    );
  }
}
