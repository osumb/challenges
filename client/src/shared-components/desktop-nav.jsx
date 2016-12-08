import React, { Component, PropTypes } from 'react';
import { grey300 } from 'material-ui/styles/colors';
import { Link } from 'react-router';
import { MenuItem } from 'material-ui/Menu';

import './desktop-nav.scss';
import { routes } from '../utils';
import LinkDropdown from './link-dropdown';

const { mainRoutes, canUserSeeLink } = routes;

export default class DesktopNav extends Component {

  static get propTypes() {
    return {
      onLogout: PropTypes.func.isRequired,
      user: PropTypes.shape({
        admin: PropTypes.bool.isRequired,
        director: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
        expires: PropTypes.number.isRequired,
        instrument: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        nameNumber: PropTypes.string.isRequired,
        part: PropTypes.string.isRequired,
        revokeTokenDate: PropTypes.number.isRequired,
        spotOpen: PropTypes.bool.isRequired,
        squadLeader: PropTypes.bool.isRequired
      })
    };
  }

  render() {
    const { user } = this.props;
    const visibleRoutes = Object.keys(mainRoutes).filter((key) => mainRoutes[key].links.some((link) => canUserSeeLink(link, user)));

    return (
      <div
        className="DesktopNav"
        style={{
          backgroundColor: grey300
        }}
      >
        <MenuItem>
          <Link to="/">Home</Link>
        </MenuItem>
        {visibleRoutes.map((key) =>
          <LinkDropdown
            className="DesktopNav-dropdown"
            displayName={mainRoutes[key].displayName}
            key={key}
            links={mainRoutes[key].links.filter((link) => canUserSeeLink(link, user))}
          />
        )}
      </div>
    );
  }
}
