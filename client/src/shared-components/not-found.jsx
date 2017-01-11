import React from 'react';
import { Link } from 'react-router';

import './not-found.scss';

const NotFound = () => (
  <div className="NotFound">
    <img src="/images/404.png" />
    <h2>Not Found</h2>
    <Link to="/">Get me outta here!</Link>
  </div>
);

export default NotFound;
