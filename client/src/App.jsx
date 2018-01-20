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
import asyncComponent from './components/async';
const ChallengeEvaluations = asyncComponent(() => import('./scenes/challenge/evaluations'));
const ChallengeSelect = asyncComponent(() => import('./scenes/performance/challenge_select'));
const CompletedResults = asyncComponent(() => import('./scenes/results/completed'));
const CreatePerformance = asyncComponent(() => import('./scenes/performance/create'));
const Login = asyncComponent(() => import('./scenes/login'));
const Navbar = asyncComponent(() => import('./components/navbar'));
const NotFound = asyncComponent(() => import('./components/not_found'));
const Profile = asyncComponent(() => import('./scenes/user/profile'));
const PasswordResetRequest = asyncComponent(() => import('./scenes/password_reset/request'));
const PasswordResetReset = asyncComponent(() => import('./scenes/password_reset/reset'));
const PerformanceIndex = asyncComponent(() => import('./scenes/performance/index'));
const ProfileAdmin = asyncComponent(() => import('./scenes/user/profile_admin'));
const Roster = asyncComponent(() => import('./scenes/user/roster'));
const Search = asyncComponent(() => import('./scenes/user/search'));
const Upload = asyncComponent(() => import('./scenes/user/upload'));
const UserCreate = asyncComponent(() => import('./scenes/user/create'));

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
          <PrivateRoute
            exact
            path="/challenges/evaluate"
            component={ChallengeEvaluations}
          />
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
          <PrivateRoute
            exact
            path="/results/completed"
            component={CompletedResults}
          />
          <PrivateRoute exact path="/user/upload" component={Upload} />
          <PrivateRoute exact path="/roster" component={Roster} />
          <PrivateRoute exact path="/search" component={Search} />
          <PrivateRoute path="/user/new" component={UserCreate} />
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
