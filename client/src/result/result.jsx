import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

export default class Result extends Component {

  static get propTypes() {
    return {
      comments: PropTypes.string,
      firstComments: PropTypes.string,
      firstName: PropTypes.string,
      firstNameNumber: PropTypes.string,
      forProfile: PropTypes.bool,
      id: PropTypes.string,
      opponentName: PropTypes.string,
      pending: PropTypes.string,
      performanceDate: PropTypes.string,
      performanceId: PropTypes.string,
      performanceName: PropTypes.string,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string,
      winner: PropTypes.string,
      winnerId: PropTypes.string
    };
  }

  render() {
    const { forProfile } = this.props;

    if (forProfile) {
      return (
        <Card>
          <CardTitle title={this.props.performanceName} subtitle={this.props.performanceDate} />
          <Divider />
          <CardHeader
            title={`${this.props.opponentName} (${this.props.spotId})`}
            subtitle={this.props.winner ? 'You Won!' : 'You Lost'}
            avatar={this.props.winner ? '/images/trophy.png' : '/images/crying-cat-face.png'}
          />
          <CardText>{this.props.comments}</CardText>
        </Card>
      );
    }

    return <div />;
  }
}
