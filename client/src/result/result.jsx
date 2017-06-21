import React from 'react';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';

const Result = ({
  comments,
  opponentName,
  performanceDate,
  performanceName,
  spotId,
  winner
}) =>
  <Card>
    <CardTitle title={performanceName} subtitle={performanceDate} />
    <Divider />
    <CardHeader
      title={`${opponentName} (${spotId})`}
      subtitle={winner ? 'You Won!' : 'You Lost'}
      avatar={winner ? '/images/trophy.png' : '/images/crying-cat-face.png'}
    />
    <CardText>{comments}</CardText>
  </Card>;

Result.propTypes = {
  comments: PropTypes.string.isRequired,
  opponentName: PropTypes.string.isRequired,
  performanceDate: PropTypes.string.isRequired,
  performanceName: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired
};

export default Result;
