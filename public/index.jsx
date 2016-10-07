import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';

import './style.scss';
import Header from './components/header';
import LoginForm from './components/login-form';
import Navbar from './components/navbar';
import { auth } from './utils';

const user = auth.getUser();

const App = () => (
  <BrowserRouter>
    {
      () => (
        <div>
          <Header />
          <Navbar user={user} />
          {user ?
            <div>Hey {user.name}!</div> :
            <LoginForm />
          }
        </div>
      )
    }
  </BrowserRouter>
);

render(<App />, document.getElementById('app'));
