/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './navbar.scss';
import { auth } from '../utils';
import ChallengesDropdown from './challenges-dropdown';
import PerformancesDropdown from './performances-dropdown';
import ResultsDropdown from './results-dropdown';

const Navbar = ({ onLogout }) => {
  const user = auth.getUser();

  return (
    <div className="Navbar">
      <div className="Navbar-left">
        <div className="Navbar-item">
          <Link className="Navbar-home" to="/">Home</Link>
        </div>
        <div className="Navbar-item">
          {user && <ChallengesDropdown admin={user.admin} />}
        </div>
        <div className="Navbar-item">
          {user && user.admin && <PerformancesDropdown />}
        </div>
        <div className="Navbar-item">
          {user && (user.squadLeader || user.admin) && <ResultsDropdown user={user} />}
        </div>
      </div>
      {user &&
        <div className="Navbar-right">
          <Link className="Navbar-settings" to="/settings">Settings</Link>
          <div className="Navbar-logout" onClick={onLogout} >
            Logout
          </div>
        </div>
      }
    </div>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default Navbar;
