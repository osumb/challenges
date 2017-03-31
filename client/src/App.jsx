/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.scss';
import { auth } from './utils';
import ChallengeEvaluations from './challenge/challenge-evaluations.jsx';
import ChallengeSelect from './scenes/performance/challenge_select';
import CompletedResults from './result/completed-results';
import CreatePerformance from './scenes/performance/create';
import Login from './scenes/login';
import Navbar from './components/navbar';
import NewPasswordChangeRequest from './password-change-request/new-password-change-request.jsx';
import NotFound from './components/not_found';
import PendingResults from './result/pending-results';
import Profile from './scenes/user/profile';
import PasswordChangeRequest from './password-change-request/password-change-request';
import Roster from './user/roster';
import UserSearch from './user/user-search';

const handleLogout = (push) => {
  auth.logout();
  push('/');
};

const PublicRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
    !auth.isAuthenticated() ? (
      React.createElement(component, props)
    ) : (
      <Redirect
        to={{
          pathname: '/',
          state: { from: props.location }
        }}
      />
    )
  )}
  />
);

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated() && auth.canUserAccess(rest.path) ? (
      React.createElement(component, props)
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location }
        }}
      />
    )
  )}
  />
);

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div id="App">
        <Navbar onLogout={handleLogout} />
        <div id="App-container">
          <Switch>
            <PrivateRoute exact path="/" component={Profile} />
            <PrivateRoute exact path="/challenges/evaluate" component={ChallengeEvaluations} />
            <PrivateRoute exact path="/challenges/new" component={ChallengeSelect} />
            <PrivateRoute exact path="/performances/new" component={CreatePerformance} />
            <PrivateRoute exact path="/results/completed" component={CompletedResults} />
            <PrivateRoute exact path="/results/pending" component={PendingResults} />
            <PrivateRoute exact path="/roster" component={Roster} />
            <PrivateRoute exact path="/search" component={UserSearch} />
            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/newPassword" component={NewPasswordChangeRequest} />
            <PublicRoute exact path="/resetPassword/:id" component={PasswordChangeRequest} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  </MuiThemeProvider>
);

export default App;
