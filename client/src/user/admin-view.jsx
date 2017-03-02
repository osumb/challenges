import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

import './admin-view.scss';
import CompletedResultAdminView from '../result/completed-result-admin-view';
import CurrentChallenge from '../challenge/current-challenge';
import Fetch from '../shared-components/fetch';
import PreviousChallenges from '../challenge/previous-challenges';

const endPoint = '/users/profile';

const AdminView = ({ challenges, results, user }) => {
  const headerStyle = {
    textAlign: 'center'
  };
  let mostRecentChallenge = challenges[0];
  let previousChallenges = challenges.splice(1);

  if (mostRecentChallenge && results.some(({ performanceId }) => mostRecentChallenge.performanceId === performanceId)) {
    previousChallenges = challenges;
    mostRecentChallenge = null;
  }

  return (
    <div className="AdminView">
      {mostRecentChallenge &&
        <CurrentChallenge {...mostRecentChallenge} />
      }
      {previousChallenges.length > 0 &&
        <div>
          <h2 style={headerStyle}>Previous Challenges</h2>
          <Paper>
            <PreviousChallenges challenges={previousChallenges} userName={user.name} />
          </Paper>
        </div>
      }
      {results.length > 0 &&
        <div className="AdminView-results">
          <h2 style={headerStyle}>
            Previous Results
          </h2>
          {results.map(({ id, ...rest }) => <CompletedResultAdminView key={id} id={id} {...rest} userNameNumber={user.nameNumber} />)}
        </div>
      }
    </div>
  );
};

AdminView.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.object),
  manageActions: PropTypes.arrayOf(PropTypes.object),
  results: PropTypes.arrayOf(PropTypes.object),
  spot: PropTypes.object,
  user: PropTypes.object
};

export default function AdminViewContainer(props) {
  return (
    <Fetch
      {...props}
      endPoint={endPoint}
      errorMessage="Couldn't load user's profile"
      paramId="nameNumber"
    >
      <AdminView />
    </Fetch>
  );
}
