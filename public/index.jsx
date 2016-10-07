import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';

import './style.scss';
import Header from './components/header';
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
          <div>Yo</div>
        </div>
      )
    }
  </BrowserRouter>
);

render(<App />, document.getElementById('app'));
