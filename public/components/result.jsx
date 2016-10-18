import React, { PropTypes } from 'react';

import './result.scss';

const winnerImg = <img style={{ height: '1.5em', width: '1.5em' }} src="/public/images/emoji/trophy.png" />;
const loserImg = <img style={{ height: '1.5em', width: '1.5em' }} src="/public/images/emoji/crying-cat-face.png" />;

const Result = ({ comments, opponentName, performanceDate, performanceName, spotId, winner }) => {
  return (
    <div className="Result">
      <div className="Result-performance">
        <h2>{performanceName}</h2>
        <h2>-</h2>
        <h2>{performanceDate}</h2>
      </div>
      <div className="Result-opponent">
        {opponentName ?
          <h2>Opponent: {opponentName} ({spotId})</h2> :
            <h2>You challenged for {spotId} by yourself!</h2>
        }
      </div>
      <div className="Result-winner">
        <h2>Winner: {winner ? winnerImg : loserImg}</h2>
      </div>
      <div className="Results-comments">
        <h2>Comments: {comments}</h2>
      </div>
    </div>
  );
};

Result.propTypes = {
  comments: PropTypes.string.isRequired,
  opponentName: PropTypes.string,
  performanceDate: PropTypes.string.isRequired,
  performanceName: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired
};

export default Result;
