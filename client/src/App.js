/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.scss';
import { auth } from './utils';
import ChallengeEvaluations from './challenge/challenge-evaluations';
import ChallengeSelect from './challenge/challenge-select';
import CompletedResults from './result/completed-results';
import CreatePerformance from './performance/create-performance';
import Login from './shared-components/login';
import Navbar from './shared-components/navbar';
import NotFound from './shared-components/not-found';
import Profile from './profile/container';

// Material-Ui needs this for click/tap events
injectTapEventPlugin();

const renderBasedOnAuth = (Component, pattern, props, user) => {
  if (auth.isAuthenticated() && auth.canUserAccess(pattern)) {
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

const MatchWhenAuthorized = ({ component: Component, pattern, user, ...rest }) => (
  <Match {...rest} pattern={pattern} render={props => (renderBasedOnAuth(Component, pattern, props, user))} />
);

const MatchWhenNotLoggedIn = ({ component: Component, pattern, ...rest }) => (
  <Match {...rest} pattern={pattern} render={(props) => {
    if (!auth.isAuthenticated()) return <Component {...props} />;
    return <Redirect to={{ pathname: '/' }} />;
  }}
  />
);

const handleLogout = (router) => {
  auth.logout();
  router.transitionTo('/');
};

const App = () => (
  <MuiThemeProvider>
    <BrowserRouter>
      {
        ({ router }) => (
          <div id="App">
            <Navbar onLogout={() => handleLogout(router)} router={router} user={auth.getUser()} />
            <div id="App-container">
              <MatchWhenAuthorized exactly pattern="/" component={Profile} />
              <MatchWhenAuthorized exactly pattern="/challenges/evaluate" component={ChallengeEvaluations} />
              <MatchWhenAuthorized exactly pattern="/challenges/new" component={ChallengeSelect} />
              <MatchWhenAuthorized exactly pattern="/performances/new" component={CreatePerformance} />
              <MatchWhenAuthorized exactly pattern="/results/completed" component={CompletedResults} />
              <MatchWhenAuthorized exactly pattern="/results/pending" component />
              <MatchWhenNotLoggedIn pattern="/login" component={Login} />
              <Miss component={NotFound} />
            </div>
          </div>
        )
      }
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
