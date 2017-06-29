/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import './App.css';
import { auth } from './utils';
// import ChallengeEvaluations from './challenge/challenge-evaluations.jsx';
import ChallengeSelect from './scenes/performance/challenge_select';
// import CompletedResults from './result/completed-results';
import CreatePerformance from './scenes/performance/create';
import Login from './scenes/login';
import Navbar from './components/navbar';
import NotFound from './components/not_found';
// import PendingResults from './result/pending-results';
import Profile from './scenes/user/profile';
import PasswordResetRequest from './scenes/password_reset/request';
import PasswordResetReset from './scenes/password_reset/reset';
import PerformanceIndex from './scenes/performance/index';
import ProfileAdmin from './scenes/user/profile_admin';
import Roster from './scenes/user/roster';
import Search from './scenes/user/search';

const handleLogout = push => {
  auth.logout();
  push('/');
};

const PublicRoute = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      !auth.isAuthenticated()
        ? React.createElement(component, props)
        : <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />}
  />;

const PrivateRoute = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated() && auth.canUserAccess(rest.path)
        ? React.createElement(component, props)
        : <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />}
  />;

const App = () =>
  <Router>
    <div id="App">
      <Navbar onLogout={handleLogout} />
      <div id="App-container">
        <Switch>
          <PrivateRoute exact path="/" component={Profile} />
          {/*<PrivateRoute
              exact
              path="/challenges/evaluate"
              component={ChallengeEvaluations}
            />*/}
          <PrivateRoute
            exact
            path="/challenges/new"
            component={ChallengeSelect}
          />
          <PrivateRoute
            exact
            path="/performances"
            component={PerformanceIndex}
          />
          <PrivateRoute
            exact
            path="/performances/new"
            component={CreatePerformance}
          />
          {/*<PrivateRoute
            exact
            path="/results/completed"
            component={CompletedResults}
          />*/}
          {/*<PrivateRoute
            exact
            path="/results/pending"
            component={PendingResults}
          />*/}
          <PrivateRoute exact path="/roster" component={Roster} />
          <PrivateRoute exact path="/search" component={Search} />
          <PrivateRoute exact path="/users/:buckId" component={ProfileAdmin} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute
            exact
            path="/password_reset_requests/new"
            component={PasswordResetRequest}
          />
          <PublicRoute
            exact
            path="/password_reset_requests/:id"
            component={PasswordResetReset}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>;

export default App;
