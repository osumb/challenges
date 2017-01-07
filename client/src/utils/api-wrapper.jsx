import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './api-wrapper.scss';
import { api } from '../utils';

class Fetch extends Component {

  static get propTypes() {
    return {
      container: PropTypes.func.isRequired,
      endPoint: PropTypes.string.isRequired,
      location: PropTypes.shape({
        query: PropTypes.object
      }),
      locationKey: PropTypes.string,
      paramId: PropTypes.string,
      params: PropTypes.object
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const { endPoint, location, locationKey, paramId, params } = this.props;
    let url = endPoint;

    if (paramId) {
      url = `${url}?${paramId}=${params[paramId]}`;
    } else if (location && locationKey) {
      url = `${url}?${locationKey}=${location.query[locationKey]}`;
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

const wrapper = (container, endPoint, paramId, locationKey) => {
  function ApiWrapper({ location, params }) {
    return (
      <Fetch
        container={container}
        endPoint={endPoint}
        location={location}
        locationKey={locationKey}
        paramId={paramId}
        params={params}
      />
    );
  }

  ApiWrapper.propTypes = {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  };

  return ApiWrapper;
};

wrapper.Fetch = Fetch;

export default wrapper;
