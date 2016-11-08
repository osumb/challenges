import React, { Component, PropTypes } from 'react';

import { api } from '../utils';

class ApiWrapper extends Component {

  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.request = api.get(this.props.url);

    this.request.then((resp) => {
      delete this.request;
      this.setState({
        ...resp,
        loading: false
      });
    });
  }

  componentWillUnMount() {
    if (this.request) {
      // TODO: make promises cancellable
      delete this.request;
    }
  }

  render() {
    const { loading, ...rest } = this.state;
    const { component: Child } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Child {...rest} />;
  }
}

ApiWrapper.propTypes = {
  component: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
};

export default ApiWrapper;
