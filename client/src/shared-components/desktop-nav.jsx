import React, { Component, PropTypes } from 'react';
import { grey300 } from 'material-ui/styles/colors';
import { Link } from 'react-router';
import { MenuItem } from 'material-ui/Menu';

import './desktop-nav.scss';
import { routes } from '../utils';
import LinkDropdown from './link-dropdown';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;

export default class DesktopNav extends Component {

  static get propTypes() {
    return {
      onLogout: PropTypes.func.isRequired,
      router: PropTypes.object.isRequired,
      user: PropTypes.shape({
        admin: PropTypes.bool.isRequired,
        director: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
        expires: PropTypes.number.isRequired,
        instrument: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        nameNumber: PropTypes.string.isRequired,
        part: PropTypes.string.isRequired,
        squadLeader: PropTypes.bool.isRequired
      })
    };
  }

  render() {
    const { user } = this.props;
    const visibleRoutes = getVisibleMainRoutesForUser(this.props.user);

    return (
      <div
        className="DesktopNav"
        style={{
          backgroundColor: grey300
        }}
      >
        <div className="DesktopNav-left">
          <MenuItem>
            <Link to="/">Home</Link>
          </MenuItem>
          {visibleRoutes.map((key) =>
            <LinkDropdown
              displayName={mainRoutes[key].displayName}
              key={key}
              links={mainRoutes[key].links.filter((link) => canUserSeeLink(link, user))}
              router={this.props.router}
            />
          )}
        </div>
        {user &&
          <MenuItem
            onTouchTap={this.props.onLogout}
            primaryText="Logout"
          />
        }
      </div>
    );
  }
}
