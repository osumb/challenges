import React from 'react';
import { Link } from 'react-router';

import './not-found.scss';

const NotFound = () => (
  <div className="NotFound">
    <img className="NotFound-image" src="/public/images/404.png" />
    <h2>Not Found</h2>
    <Link className="NotFound-link" to="/">Get me outta here!</Link>
  </div>
);

export default NotFound;
