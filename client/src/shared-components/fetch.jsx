import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './fetch.scss';
import { api, errorEmitter } from '../utils';

export default class Fetch extends Component {
  static get propTypes() {
    return {
      children: PropTypes.element.isRequired,
      endPoint: PropTypes.string.isRequired,
      errorMessage: PropTypes.string,
      location: PropTypes.shape({
        query: PropTypes.object
      }).isRequired,
      locationKey: PropTypes.string,
      match: PropTypes.object,
      paramId: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: false
    };
  }

  componentDidMount() {
    const { endPoint, errorMessage, match, paramId } = this.props;
    const { params } = match;

    try {
      const url = paramId
        ? `${endPoint}?${paramId}=${params[paramId]}`
        : endPoint;

      api.get(url, errorMessage).then(data => {
        this.setState({ data, error: false });
      });
    } catch (e) {
      errorEmitter.dispatch(
        errorMessage || 'Sorry, there was a problem sending your request'
      );
      console.error(e);
    }
  }

  render() {
    const { data, error } = this.state;

    if (!data) {
      return <div className="Fetch">Loading...</div>;
    }

    return !error && React.cloneElement(this.props.children, { ...data });
  }
}
