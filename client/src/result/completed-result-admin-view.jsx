import React, { Component, PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

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
    const textDivPadding = '0 16px';
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
        <CardTitle
          title={performanceName}
          subtitle={spotId}
        />
        <div style={{ display: 'flex', padding: textDivPadding }}>
          <h3 style={{ flex: '1', textAlign: 'left', fontWeight: winnerId === firstNameNumber ? 'bold' : 'lighter' }}>
            {firstName}
          </h3>
          {secondName &&
            <h3 style={{ flex: '1', textAlign: 'center', fontWeight: 'lighter' }}>vs</h3>
          }
          {secondName &&
            <h3 style={{ flex: '1', textAlign: 'right', fontWeight: winnerId !== firstNameNumber ? 'bold' : 'lighter' }}>
              {secondName}
            </h3>
          }
        </div>
        <div style={{ display: 'flex', marginTop: '-20px', padding: textDivPadding }}>
          <p style={{ color: 'rgb(183, 28, 28)', flex: '1', textAlign: winnerId === firstNameNumber ? 'left' : 'right' }}>*Winner</p>
        </div>
        <h3 style={{ padding: textDivPadding }}>{`${displayName.split(' ')[0]}'s`} comments: </h3>
        <CardText className="CompletedResultAdminView-comments" style={{ fontSize: '18px', padding: textDivPadding }}>{userComments}</CardText>
      </Card>
    );
  }
}
