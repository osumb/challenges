import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

import './completed-results.scss';
import { api, compareSpots } from '../utils';
import CompletedResult from './completed-result';
import Fetch from '../shared-components/fetch';

const getEndPoint = '/results/completed';

class CompletedResults extends Component {
  static get propTypes() {
    return {
      performanceResultsMap: PropTypes.object
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      performanceResultsMap: Object.keys(
        props.performanceResultsMap
      ).reduce((acc, curr) => {
        const map = props.performanceResultsMap[curr];

        acc[curr] = {
          performanceName: map.performanceName,
          results: map.results.reduce((prev, current) => {
            prev[current.id] = current;

            return prev;
          }, {})
        };

        return acc;
      }, {}),
      requestingResult: null,
      success: false
    };
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleEditRequest = this.handleEditRequest.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleConfirmClose() {
    this.setState({ requestingResult: null, success: false });
  }

  handleEditRequest(requestingResult) {
    this.setState({ requestingResult, success: false });
  }

  handleSubmit() {
    const { performanceResultsMap, requestingResult } = this.state;

    if (requestingResult) {
      api
        .put('/results/completed', {
          id: requestingResult.id,
          firstComments: requestingResult.firstComments,
          secondComments: requestingResult.secondComments
        })
        .then(() => {
          this.setState({
            performanceResultsMap: {
              ...performanceResultsMap,
              [requestingResult.performanceId]: {
                ...performanceResultsMap[requestingResult.performanceId],
                results: {
                  ...performanceResultsMap[requestingResult.performanceId]
                    .results,
                  [requestingResult.id]: {
                    ...requestingResult
                  }
                }
              }
            },
            requestingResult: null,
            success: true
          });
        });
    }
  }

  render() {
    const { performanceResultsMap, requestingResult, success } = this.state;
    const performanceIds = Object.keys(performanceResultsMap).sort(
      (a, b) => b - a
    );

    if (performanceIds.length < 1) {
      return <h2>There are no completed results</h2>;
    }

    const performances = performanceIds.map(id => {
      const performanceResults = performanceResultsMap[id];
      const sortedResultIds = Object.keys(
        performanceResults.results
      ).sort((rIdA, rIdB) => {
        const resultA = performanceResults.results[rIdA],
          resultB = performanceResults.results[rIdB];

        return compareSpots(resultA.spotId, resultB.spotId);
      });

      return (
        <div key={id}>
          <h1>{performanceResults.performanceName}</h1>
          <div className="CompletedResults-results">
            {sortedResultIds.map(rId =>
              <CompletedResult
                key={rId}
                {...performanceResults.results[rId]}
                onEditRequest={this.handleEditRequest}
              />
            )}
          </div>
        </div>
      );
    });
    const dialogActions = [
      <FlatButton key="cancel" onTouchTap={this.handleConfirmClose}>
        No
      </FlatButton>,
      <FlatButton key="submit" onTouchTap={this.handleSubmit}>
        Submit
      </FlatButton>
    ];

    return (
      <div className="CompletedResults">
        {performances}
        <Dialog
          actions={dialogActions}
          onRequestClose={this.handleConfirmClose}
          open={
            requestingResult !== null && typeof requestingResult !== 'undefined'
          }
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

export default function CompletedResultsWrapper(props) {
  return (
    <Fetch {...props} endPoint={getEndPoint}>
      <CompletedResults />
    </Fetch>
  );
}
