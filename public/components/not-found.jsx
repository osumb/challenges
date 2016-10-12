import React from 'react';
import { Link } from 'react-router';
import Media from 'react-media';

import './not-found.scss';

const minWidth = 768;

const NotFound = () => (
  <div className="NotFound">
    <Media query={{ minWidth }}>
      {(matches) => matches ?
        <img className="NotFound-image" src="/public/images/404.png" /> :
        <img className="NotFound-image--mobile" src="/public/images/404.png" />
      }
    </Media>
    <h2>Not Found</h2>
    <Link className="NotFound-link" to="/">Get me outta here!</Link>
  </div>
);

export default NotFound;
