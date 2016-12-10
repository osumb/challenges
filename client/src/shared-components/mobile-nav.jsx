import React, { Component, PropTypes } from 'react';
import ActionList from 'material-ui/svg-icons/action/list';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { grey800 } from 'material-ui/styles/colors';
import { routes } from '../utils';

import './mobile-nav.scss';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;

export default class MobileNav extends Component {

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

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleLogout() {
    this.setState({
      open: false
    });
    this.props.onLogout();
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  render() {
    const style = {
      backgroundColor: grey800
    };
    const visibleRoutes = getVisibleMainRoutesForUser(this.props.user);

    return (
      <AppBar
        className="MobileNav"
        iconElementLeft={this.props.user ?
          <IconButton onClick={this.handleOpen}><ActionList /></IconButton> :
          <span />
        }
        style={style}
        title="OSUMB Challenges"
      >
        {this.props.user && this.state.open &&
          <Drawer
            docked
            onOpenRequest
            open={this.state.open}
            width={200}
          >
            <IconButton onClick={this.handleClose}><ActionHighlightOff /></IconButton>
            <List>
              <ListItem>
                <span onClick={this.handleClose}><Link to="/">Home</Link></span>
              </ListItem>
              {visibleRoutes.map((key) =>
                <span key={key}>
                  <Divider />
                  <ListItem
                    nestedItems={mainRoutes[key].links.filter((route) => canUserSeeLink(route, this.props.user)).map((route) =>
                      <ListItem key={route.path}>
                        <span onClick={this.handleClose}><Link to={route.path}>{route.name}</Link></span>
                      </ListItem>
                    )}
                    primaryText={mainRoutes[key].displayName}
                    primaryTogglesNestedList
                  />
                </span>
              )}
              <Divider />
              <ListItem
                onClick={this.handleLogout}
                primaryText="Logout"
              />
            </List>
          </Drawer>
        }
      </AppBar>
    );
  }
}
