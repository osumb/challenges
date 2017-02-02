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
import AdminView from './user/admin-view';
import ChallengeEvaluations from './challenge/challenge-evaluations';
import ChallengeSelect from './challenge/challenge-select';
import CompletedResults from './result/completed-results';
import CreatePerformance from './performance/create-performance';
import Login from './navigation/login';
import Navbar from './navigation/navbar';
import NewPasswordChangeRequest from './password-change-request/new-password-change-request.jsx';
import NotFound from './navigation/not-found';
import PendingResults from './result/pending-results';
import Performances from './performance/performances';
import Profile from './profile/profile';
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
<<<<<<< HEAD
    <BrowserRouter>
      {
        ({ router }) => (
          <div id="App">
            <Navbar onLogout={() => handleLogout(router)} router={router} user={auth.getUser()} />
            <div id="App-container">
              <MatchWhenAuthorized exactly pattern="/" component={Profile} />
              <MatchWhenAuthorized exactly pattern="/challenges/evaluate" component={ChallengeEvaluations} />
              <MatchWhenAuthorized exactly pattern="/challenges/new" component={ChallengeSelect} />
              <MatchWhenAuthorized exactly pattern="/performances" component={Performances} />
              <MatchWhenAuthorized exactly pattern="/performances/new" component={CreatePerformance} />
              <MatchWhenAuthorized exactly pattern="/results/completed" component={CompletedResults} />
              <MatchWhenAuthorized exactly pattern="/results/pending" component={PendingResults} />
              <MatchWhenAuthorized exactly pattern="/search" component={UserSearch} router={router} />
              <MatchWhenAuthorized exactly pattern="/users/:nameNumber" component={AdminView} />
              <MatchWhenAuthorized exactly pattern="/roster" component={Roster} />
              <MatchWhenNotLoggedIn pattern="/login" component={Login} />
              <MatchWhenNotLoggedIn exactly pattern="/newPassword" component={NewPasswordChangeRequest} />
              <MatchWhenNotLoggedIn exactly pattern="/resetPassword" component={PasswordChangeRequest} />
              <Miss component={NotFound} />
            </div>
          </div>
        )
      }
    </BrowserRouter>
=======
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
            <PrivateRoute exact path="/users/:nameNumber" component={AdminView} />
            <PublicRoute exact path="/login" component={Login} />
            <PublicRoute exact path="/newPassword" component={NewPasswordChangeRequest} />
            <PublicRoute exact path="/resetPassword/:id" component={PasswordChangeRequest} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
>>>>>>> master
  </MuiThemeProvider>
);

export default App;
