import React, { Component } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import '../../node_modules/react-datetime/css/react-datetime.css';
import './create-performance.scss';
import { api } from '../utils';

const getErrorMessage = ({ closeAt, performanceName, openAt, performanceDate }) => {
  const errorMessages = ['Error(s):'];

  if (!performanceName) errorMessages.push('Please enter a performance name.');
  if (!moment(performanceDate).isValid()) errorMessages.push('Please enter a valid performance date.');
  if (!moment(openAt).isValid()) errorMessages.push('Please enter a valid opening time.');
  if (!moment(closeAt).isValid()) errorMessages.push('Please enter a valid closing time.');
  if (moment(closeAt).isBefore(openAt)) errorMessages.push('The closing time can\'t be before the opening time.');
  return errorMessages.join(' ');
};

const validInput = ({ closeAt, performanceName, openAt, performanceDate }) => {
  if (!performanceName || !performanceDate || !openAt || !closeAt) return false;
  if (!moment(performanceDate).isValid() || !moment(openAt).isValid() || !moment(closeAt).isValid()) return false;
  if (moment(closeAt).isBefore(openAt)) return false;
  return true;
};

export default class CreatePerformance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      closeAt: '',
      errorMessage: null,
      openAt: '',
      performanceDate: '',
      performanceName: '',
      success: false
    };
    this.handleCloseAtChange = this.handleCloseAtChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handlePerformanceNameChange = this.handlePerformanceNameChange.bind(this);
    this.handleOpenAtChange = this.handleOpenAtChange.bind(this);
    this.handlePerformDateChange = this.handlePerformDateChange.bind(this);
  }

  handleCloseAtChange(closeAt) {
    this.setState({ closeAt, success: false });
  }

  handleOpenAtChange(openAt) {
    this.setState({ openAt, success: false });
  }

  handlePerformDateChange(performanceDate) {
    this.setState({ performanceDate, success: false });
  }

  handlePerformanceNameChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      success: false
    });
  }

  handleEnter() {
    const { state } = this;

    if (validInput(state)) {
      delete state.errorMessages;
      delete state.success;

      api.post('/performances', state)
        .then(() => {
          this.setState({
            errorMessage: null,
            success: true
          });
        })
        .catch(() => {
          this.setState({
            success: false
          });
        });
    } else {
      this.setState({ errorMessage: getErrorMessage(state), success: false });
    }
  }

  render() {
    const { errorMessage, performanceName, success } = this.state;

    return (
      <div className="CreatePerformance">
        <h1>Create Performance</h1>
        <Snackbar
          autoHideDuration={3000}
          message={`Created ${performanceName}`}
          open={success}
        />
        {errorMessage && <h3>**{errorMessage}**</h3>}
        <div className="CreatePerformance-form">
          <div className="CreatePerformance-item">
            <TextField
              autoFocus
              name="performanceName"
              onChange={this.handlePerformanceNameChange}
              placeholder="Name"
              value={performanceName}
            />
          </div>
          <div className="CreatePerformance-item">
            <label>Date of performance</label>
            <Datetime className="CreatePerformance-dateInput" onChange={this.handlePerformDateChange} />
          </div>
          <div className="CreatePerformance-item">
            <label>When does the challenge window open&#63;</label>
            <Datetime className="CreatePerformance-dateInput" onChange={this.handleOpenAtChange} />
          </div>
          <div className="CreatePerformance-item">
            <label>When does the challenge window close&#63;</label>
            <Datetime className="CreatePerformance-dateInput" onChange={this.handleCloseAtChange} />
          </div>
          <RaisedButton onTouchTap={this.handleEnter}>Submit</RaisedButton>
        </div>
      </div>
    );
  }
}
