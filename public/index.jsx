/* eslint-disable react/prop-types, react/no-multi-comp, react/jsx-no-bind */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';

import './style.scss';
import Header from './components/header';
import Login from './components/login';
import Navbar from './components/navbar';
import NotFound from './components/not-found';
import Test from './components/test';
import { auth } from './utils';

const renderBasedOnAuth = (Component, pattern, props) => {
  if (auth.isAuthenticated() && auth.userCanAccess(pattern)) {
    return <Component />;
  } else if (auth.isAuthenticated()) {
    return <NotFound />;
  } else {
    return (
      <Redirect to={{
        pathname: '/login',
        stats: { from: props.location }
      }} />
    );
  }
};

const MatchWhenAuthorized = ({ component: Component, pattern, ...rest }) => (
  <Match {...rest} pattern={pattern} render={props => (renderBasedOnAuth(Component, pattern, props))} />
);

const handleLogout = (router) => {
  auth.logout();
  router.transitionTo('/');
};

const App = () => {
  return (
    <BrowserRouter>
      {
        ({ router }) => (
          <div className="App">
            <Header />
            <Navbar onLogout={handleLogout.bind(null, router)} />
            <div className="Main">
              <MatchWhenAuthorized exactly pattern="/" component={Test} />
              <Match pattern="/login" component={Login} />
              <Miss component={NotFound} />
            </div>
          </div>
        )
      }
    </BrowserRouter>
  );
};

render(<App />, document.getElementById('app'));
