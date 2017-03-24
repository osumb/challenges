/* eslint-disable global-require, react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.scss';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    ReactDOM.render(
      <NextApp />,
      document.getElementById('root')
    );
  });
}
