/* eslint-disable global-require, react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'material-components-web/dist/material-components-web.min.css';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
