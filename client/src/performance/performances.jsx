import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import './performances.scss';
import { api, errorEmitter } from '../utils';
import Fetch from '../shared-components/fetch';
import Performance from './performance';

function getStateFromProps({ performances }) {
  return {
    performances: performances.reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {}),
    requestingPerformance: null,
    success: false
  };
}

class Performances extends Component {

  static get propTypes() {
    return {
      performances: PropTypes.arrayOf(PropTypes.shape({
        closeAt: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        listExported: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        openAt: PropTypes.string.isRequired,
        performDate: PropTypes.string.isRequired
      }))
    };
  }

  constructor(props) {
    super(props);
    this.state = getStateFromProps(props);
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleEditRequest = this.handleEditRequest.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleConfirmClose() {
    this.setState(getStateFromProps(this.props));
  }

  handleEditRequest(performance) {
    this.setState({ requestingPerformance: performance });
  }

  handleSubmit() {
    const { performances, requestingPerformance } = this.state;
    const { closeAt, openAt } = requestingPerformance;

    if (new Date(closeAt).getTime() > new Date(openAt).getTime()) {
      api.put('/performances', requestingPerformance, 'Couldn\'t update performance')
      .then(() => {
        this.setState({
          performances: {
            ...performances,
            [requestingPerformance.id]: requestingPerformance
          },
          requestingPerformance: null,
          success: true
        });
      });
    } else {
      errorEmitter.dispatch('Error. Make sure the performance opening time is before the closing time');
    }
  }

  render() {
    const { requestingPerformance, performances, success } = this.state;
    const dialogActions = [
      <FlatButton key="cancel" onTouchTap={this.handleConfirmClose}>No</FlatButton>,
      <FlatButton key="submit" onTouchTap={this.handleSubmit}>Submit</FlatButton>
    ];

    return (
      <div className="Performances">
        <h2>Past/Current Performances</h2>
        <div className="Performances-wrapper">
          {Object.keys(performances).map((key) => (
            <Performance key={key} {...performances[key]} onEdit={this.handleEditRequest} />
          ))}
        </div>
        <Dialog
          actions={dialogActions}
          onRequestClose={this.handleConfirmClose}
          open={requestingPerformance !== null && typeof requestingPerformance !== 'undefined'}
        >
          Are you sure you want to update this result&#63;
        </Dialog>
        <Snackbar
          autoHideDuration={3000}
          message="Updated Result"
          open={success}
        />
      </div>
    );
  }
}

export default function PerformancesContainer(props) {
  return (
    <Fetch
      {...props}
      endPoint="/performances"
      errorMessage="Error fetching performances"
    >
      <Performances />
    </Fetch>
  );
}
