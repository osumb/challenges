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
      id: PropTypes.number,
      opponentName: PropTypes.string,
      pending: PropTypes.string,
      performanceDate: PropTypes.string,
      performanceId: PropTypes.number,
      performanceName: PropTypes.string,
      secondComments: PropTypes.string,
      secondName: PropTypes.string,
      secondNameNumber: PropTypes.string,
      spotId: PropTypes.string,
      winner: PropTypes.bool,
      winnerId: PropTypes.string
    };
  }

  render() {
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
}
