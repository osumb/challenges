import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'whatwg-fetch';

class App extends Component {

  componentDidMount() {
    fetch('http://localhost:3001/api/token', {
      headers: { // eslint-disable-line quote-props
        Accept: 'application/json, text/html',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
    .then((res) => console.log(res))
    .catch((e) => {
      console.log('Got an error!');
      console.trace(e);
    });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
