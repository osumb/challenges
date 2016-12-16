/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.scss';
import { auth } from './utils';
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
            <Navbar onLogout={() => handleLogout(router)} user={auth.getUser()} />
            <div id="App-container">
              <MatchWhenAuthorized exactly pattern="/" component={Profile} />
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
