import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './api-wrapper.scss';
import { api } from '../utils';

class Fetch extends Component {

  static get propTypes() {
    return {
      container: PropTypes.func.isRequired,
      endPoint: PropTypes.string.isRequired,
      paramId: PropTypes.string,
      params: PropTypes.object.isRequired,
      query: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const { endPoint, paramId, params, query } = this.props;
    let url = endPoint;

    if (paramId && query) {
      url = `${url}/?${paramId}=${params[paramId]}`;
    }

    api.get(url)
    .then((response) => {
      this.setState({
        data: response
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    const { container: Container } = this.props;
    const { data } = this.state;

    if (!data) {
      return <div className="Fetch"><CircularProgress /></div>;
    }

    return <Container {...data} />;
  }
}

const wrapper = (container, endPoint, paramId, query) => {
  function ApiWrapper({ params }) {
    return <Fetch container={container} endPoint={endPoint} paramId={paramId} params={params} query={query} />;
  }

  ApiWrapper.propTypes = {
    params: PropTypes.object.isRequired
  };

  return ApiWrapper;
};

export default wrapper;
