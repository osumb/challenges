/* eslint-disable global-require, react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js';

import './index.css';
import 'material-components-web/dist/material-components-web.min.css';
import App from './App';

// Configure sentry
Raven.config(process.env.REACT_APP_SENTRY_CLIENT_DSN).install();

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
