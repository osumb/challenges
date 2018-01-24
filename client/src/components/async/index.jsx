import React, { Component } from 'react';
import Loadable from 'react-loadable';

import { errorEmitter } from '../../utils';

const Loading = function({ isLoading, error }) {
  if (isLoading) {
    return null;
  }

  if (error) {
    errorEmitter.dispatch(
      'Sorry! There was trouble loading the page. Please refresh.'
    );
  }

  return null;
};

export default function asyncComponent(importComponent) {
  return Loadable({
    loader: importComponent,
    loading: Loading
  });
}
