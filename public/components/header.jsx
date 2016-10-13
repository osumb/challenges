import React from 'react';
import { Link } from 'react-router';
import Media from 'react-media';

import './header.scss';

const minWidth = 900;

const Header = () => (
  <Media query={{ minWidth }}>
    {(matches) =>
      <div className="Header">
        <div className="Header-title">
          {matches ?
            <h1 className="Header-main"><Link className="Header-link" to="/">OSUMB Challenge Manager</Link></h1> :
            <h1 className="Header-main Header-mobile"><Link className="Header-link" to="/">OSUMB Challenges</Link></h1>
          }
        </div>
        <div>
          {matches ?
            <img className="Header-image" src="/public/images/script-ohio-white.png" /> :
            <img className="Header-image--mobile" src="/public/images/script-ohio-white.png" />
          }
        </div>
      </div>
    }
  </Media>
);

export default Header;
