import React, { PropTypes } from 'react';
import moment from 'moment';

import './challenge-window.scss';

const ChallengeWindow = ({ closeAt, name, openAt, windowOpen }) => {
  if (windowOpen) {
    return (
      <h2 className="ChallengeWindow">
        {name} challenges are open now!
        <br />
        It closes at {moment(closeAt).format('MMM, Do h:mm A')}
      </h2>
    );
  }

  return (
    <h3 className="ChallengeWindow">Challenge signup for {name} <br />
      Opens: {moment(openAt).format('MMM, Do h:mm A')} <br />
      Closes: {moment(closeAt).format('MMM, Do h:mm A')}
    </h3>
  );
};

ChallengeWindow.propTypes = {
  closeAt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  openAt: PropTypes.string.isRequired,
  windowOpen: PropTypes.bool.isRequired
};

export default ChallengeWindow;
