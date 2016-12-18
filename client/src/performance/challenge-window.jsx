import React, { PropTypes } from 'react';
import moment from 'moment';

import './challenge-window.scss';

const ChallengeWindow = ({ closeAt, name, openAt, windowOpen }) => {
  if (windowOpen) {
    return (
      <div>
        <h2 className="ChallengeWindow">{name} challenges are open now!</h2>
        <h2 className="ChallengeWindow">It closes at {moment(closeAt).format('MMM, Do h:mm A')}</h2>
      </div>
    );
  }

  return (
    <div>
      <h3 className="ChallengeWindow">Challenge signup for {name}</h3>
      <h3 className="ChallengeWindow">Opens: {moment(openAt).format('MMM, Do h:mm A')}</h3>
      <h3 className="ChallengeWindow">Closes: {moment(closeAt).format('MMM, Do h:mm A')}</h3>
    </div>
  );
};

ChallengeWindow.propTypes = {
  closeAt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  openAt: PropTypes.string.isRequired,
  windowOpen: PropTypes.bool.isRequired
};

export default ChallengeWindow;
