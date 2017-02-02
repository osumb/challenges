import React, { Component, PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

import './pending-results.scss';
import { api } from '../utils';
import Fetch from '../shared-components/fetch';
import PendingResult from './pending-result';
import RaisedButton from 'material-ui/RaisedButton';

const endPoint = '/results/pending';
const approveEndPoint = '/results/approve';

class PendingResults extends Component {

  static get propTypes() {
    return {
      results: PropTypes.arrayOf(PropTypes.shape({
        firstComments: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        firstNameNumber: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        secondComments: PropTypes.string,
        secondName: PropTypes.string,
        secondNameNumber: PropTypes.string,
        spotId: PropTypes.string.isRequired,
        winnerId: PropTypes.string.isRequired
      }))
    };
  }

  constructor(props) {
    super(props);
    const { results } = this.props;

    this.state = {
      results,
      success: false
    };
    this.handleApproveOne = this.handleApproveOne.bind(this);
    this.handleApproveAll = this.handleApproveAll.bind(this);
  }

  handleApproveOne(id) {
    api.put(approveEndPoint, { ids: [id] })
    .then(() => {
      const { results } = this.state;

      this.setState({
        results: results.filter(({ id: rId }) => rId !== id),
        success: true
      });
    });
  }

  handleApproveAll() {
    api.put(approveEndPoint, {
      ids: this.state.results.map(({ id }) => id)
    })
    .then(() => {
      this.setState({
        results: [],
        success: true
      });
    });
  }

  render() {
    const { results, success } = this.state;

    if (results.length < 1) {
      return (
        <div>
          <h2 style={{ textAlign: 'center' }}>No results to approve</h2>
          <Snackbar
            autoHideDuration={3000}
            message="Approved Result(s)"
            open={success}
          />
        </div>
      );
    }

    return (
      <div className="PendingResults">
        <Snackbar
          autoHideDuration={3000}
          message="Approved Result(s)"
          open={success}
        />
        <div className="PendingResults-header">
          <h2>Approve/Edit Pending Results</h2>
          <RaisedButton
            className="PendingResults-button"
            onTouchTap={this.handleApproveAll}
          >
            Approve All
          </RaisedButton>
        </div>
        <div className="PendingResults-results">
          {results.map(({ id, ...rest }) => (
            <PendingResult key={id} id={id} {...rest} onApprove={this.handleApproveOne} />
          ))}
        </div>
      </div>
    );
  }
}

export default function PendingResultsContainer(props) {
  return (
    <Fetch
      {...props}
      endPoint={endPoint}
    >
      <PendingResults />
    </Fetch>
  );
}
