/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';

import './style.scss';
import { auth } from './utils';
import ChallengeSelect from './components/challenge-select';
import CreatePerformance from './components/create-performance';
import ForgotPassword from './components/forgot-password';
import Header from './components/header';
import Login from './components/login';
import Navbar from './components/navbar';
import NotFound from './components/not-found';
import PastResults from './components/past-results';
import Profile from './components/profile';
import ResetPassword from './components/reset-password';
import ResultsForApproval from './components/results-for-approval';
import ResultsForEvaluation from './components/results-for-evaluation';
import User from './components/user';
import Users from './components/users';
import UserSearch from './components/user-search';

const renderBasedOnAuth = (Component, pattern, props, user) => {
  if (auth.isAuthenticated() && auth.userCanAccess(pattern)) {
    return <Component {...props} user={user} />;
  } else if (auth.isAuthenticated()) {
    return <NotFound />;
  } else {
    return (
      <Redirect to={{
        pathname: '/login',
        stats: { from: props.location }
      }}
      />
    );
  }
};

const MatchWhenNotLoggedIn = ({ component: Component, pattern, ...rest }) => (
  <Match {...rest} pattern={pattern} render={(props) => {
    if (!auth.isAuthenticated()) return <Component {...props} />;
    return <Redirect to={{ pathname: '/' }} />;
  }}
  />
);

const MatchWhenAuthorized = ({ component: Component, pattern, user, ...rest }) => (
  <Match {...rest} pattern={pattern} render={props => (renderBasedOnAuth(Component, pattern, props, user))} />
);

const handleLogout = (router) => {
  auth.logout();
  router.transitionTo('/');
};

const App = () => (
  <BrowserRouter>
    {
      ({ router }) => (
        <div className="App">
          <Header />
          <Navbar onLogout={handleLogout.bind(null, router)} user={auth.getUser()} />
          <div className="Main">
            <MatchWhenAuthorized exactly pattern="/" component={Profile} />
            <MatchWhenAuthorized exactly pattern="/challenges/evaluate" component={ResultsForEvaluation} />
            <MatchWhenAuthorized exactly pattern="/challenges/new" component={ChallengeSelect} />
            <MatchWhenAuthorized exactly pattern="/performances/new" component={CreatePerformance} />
            <MatchWhenAuthorized exactly pattern="/results" component={PastResults} />
            <MatchWhenAuthorized exactly pattern="/results/toApprove" component={ResultsForApproval} />
            <MatchWhenAuthorized exactly pattern="/users" component={Users} />
            <MatchWhenAuthorized exactly pattern="/users/search" component={UserSearch} />
            <MatchWhenAuthorized exactly pattern="/users/profile/:nameNumber" component={User} />
            <MatchWhenNotLoggedIn pattern="/forgotPassword" component={ForgotPassword} />
            <MatchWhenNotLoggedIn pattern="/login" component={Login} />
            <MatchWhenNotLoggedIn pattern="/resetPassword" component={ResetPassword} />
            <Miss component={NotFound} />
          </div>
        </div>
      )
    }
  </BrowserRouter>
);

render(<App />, document.getElementById('app'));
