import React, { PropTypes } from 'react';

import './admin-view.scss';
import { apiWrapper } from '../utils';
import CompletedResultAdminView from '../result/completed-result-admin-view';
import CurrentChallenge from '../challenge/current-challenge';
import UserHeader from '../shared-components/user-header';
import PreviousChallenges from '../challenge/previous-challenges';

const endPoint = '/users/profile';

const AdminView = ({ challenges, results, spot, user }) => {
  let mostRecentChallenge = challenges[0];
  let previousChallenges = challenges.splice(1);

  if (mostRecentChallenge && results.some(({ performanceId }) => mostRecentChallenge.performanceId === performanceId)) {
    previousChallenges = challenges;
    mostRecentChallenge = null;
  }

  return (
    <div className="AdminView">
      <UserHeader admin={user.admin} name={user.name} spotId={spot.id} />
      {mostRecentChallenge &&
        <CurrentChallenge {...mostRecentChallenge} />
      }
      {previousChallenges.length > 0 && <PreviousChallenges challenges={previousChallenges} userName={user.name} />}
      {results.length > 0 &&
        <div className="AdminView-results">
          <h2
            style={{
              textAlign: 'center'
            }}
          >
            Previous Results for {user.name.split(' ')[0]}
          </h2>
          {results.map(({ id, ...rest }) => <CompletedResultAdminView key={id} id={id} {...rest} userNameNumber={user.nameNumber} />)}
        </div>
      }
    </div>
  );
};

AdminView.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  manageActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  spot: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const Wrapper = apiWrapper(AdminView, endPoint, 'nameNumber');

export default Wrapper;
