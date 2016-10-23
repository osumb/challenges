import React, { PropTypes } from 'react';

import './result-for-user.scss';

const winnerImg = <img style={{ height: '1.5em', width: '1.5em' }} src="/public/images/emoji/trophy.png" />;
const loserImg = <img style={{ height: '1.5em', width: '1.5em' }} src="/public/images/emoji/crying-cat-face.png" />;

const ResultForUser = ({ comments, opponentName, performanceDate, performanceName, spotId, winner }) => {
  return (
    <div className="ResultForUser">
      <div className="ResultForUser-performance">
        <h2>{performanceName}</h2>
        <h2>-</h2>
        <h2>{performanceDate}</h2>
      </div>
      <div className="ResultForUser-opponent">
        {opponentName ?
          <h2>Opponent: {opponentName} ({spotId})</h2> :
            <h2>You challenged for {spotId} by yourself!</h2>
        }
      </div>
      <div className="ResultForUser-winner">
        <h2>Winner: {winner ? winnerImg : loserImg}</h2>
      </div>
      <div className="ResultForUser-comments">
        <h2>Comments: {comments}</h2>
      </div>
    </div>
  );
};

ResultForUser.propTypes = {
  comments: PropTypes.string.isRequired,
  opponentName: PropTypes.string,
  performanceDate: PropTypes.string.isRequired,
  performanceName: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired
};

export default ResultForUser;
