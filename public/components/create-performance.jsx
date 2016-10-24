import React, { Component } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';

import '../../node_modules/react-datetime/css/react-datetime.css';
import { api } from '../utils';
import Banner from './banner';

const inputValid = (name, date, openAt, closeAt) => {
  if (!name || !date || !openAt || !closeAt) return false;
  if (!moment(date).isValid() || !moment(openAt).isValid() || !moment(closeAt).isValid()) return false;
  return true;
};

export default class CreatePerformance extends Component {

  constructor() {
    super();
    this.state = {
      closeAt: '',
      date: '',
      openAt: '',
      success: false,
      valid: true
    };
    this.handleCloseAtChange = this.handleCloseAtChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleOpenAtChange = this.handleOpenAtChange.bind(this);
  }

  handleClick() {
    // Datetime values are moment.js objects
    const { date, openAt, closeAt } = this.state;
    const { name } = this.refs;

    if (inputValid(name.value, date, openAt, closeAt)) {
      api.post('/performances/create', {
        closeAt,
        performanceName: name.value,
        performanceDate: date,
        openAt
      })
      .then(() => {
        this.setState({
          success: true,
          valid: true
        });
      });
    } else {
      this.setState({
        ...this.state,
        success: false,
        valid: false
      });
    }
  }

  handleCloseAtChange(closeAt) {
    this.setState({
      ...this.state,
      closeAt
    });
  }

  handleDateChange(date) {
    this.setState({
      ...this.state,
      date
    });
  }

  handleOpenAtChange(openAt) {
    this.setState({
      ...this.state,
      openAt
    });
  }

  render() {
    const { success, valid } = this.state;

    return (
      <div className="CreatePerformance">
        {success && <Banner message="Successfully Created Performance" /> }
        {!valid && <Banner message="Sorry, that was invalid input. Please try again" /> }
        <h2>Create New Performance</h2>
        <div className="CreatePerformance-item">
          <label>Name</label>
          <input autoFocus placeholder="Name" ref="name" type="text" />
        </div>
        <div className="CreatePerformance-item">
          <label>Date of Performance</label>
          <Datetime onChange={this.handleDateChange} />
        </div>
        <div className="CreatePerformance-item">
          <label>When does the challenge window open?</label>
          <Datetime onChange={this.handleOpenAtChange} />
        </div>
        <div className="CreatePerformance-item">
          <label>When does the challenge window close?</label>
          <Datetime onChange={this.handleCloseAtChange} />
        </div>
        <div className="CreatePerformance-item">
          <button className="CreatePerformance-button" onClick={this.handleClick} >Submit</button>
        </div>
      </div>
    );
  }
}
