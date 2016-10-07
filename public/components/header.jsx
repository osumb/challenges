import React from 'react';
import { Link } from 'react-router';
import Media from 'react-media';

import './header.scss';

const minWidth = 900;

const Header = () => (
  <div className="Header">
    <div className="Header-title">
      <Media query={{ minWidth }}>
        {(matches) => matches ?
          <h1 className="Header-main"><Link className="Header-link" to="/">OSUMB Challenge Manager</Link></h1> :
          <h1 className="Header-main Header-mobile"><Link className="Header-link" to="/">OSUMB Challenges</Link></h1>
        }
      </Media>
    </div>
    <div>
      <Media query={{ minWidth }}>
        {(matches) => matches ?
          <img className="Header-image" src="/public/images/script-ohio-white.png" /> :
          <img className="Header-image--mobile" src="/public/images/script-ohio-white.png" />
        }
      </Media>
    </div>
  </div>
);

export default Header;
