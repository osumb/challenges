import React, { Component, PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

import './pending-results.scss';
import { api } from '../utils';
import ApiWrapper from '../shared-components/api-wrapper';
import PendingResult from './pending-result';

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

  render() {
    const { results, success } = this.state;

    return (
      <div className="PendingResults">
        <Snackbar
          autoHideDuration={3000}
          message="Approved Result(s)"
          open={success}
        />
        {results.map(({ id, ...rest }) => (
          <PendingResult key={id} id={id} {...rest} onApprove={this.handleApproveOne} />
        ))}
      </div>
    );
  }
}

const Wrapper = () => <ApiWrapper endPoint={endPoint} container={PendingResults} />;

export default Wrapper;
