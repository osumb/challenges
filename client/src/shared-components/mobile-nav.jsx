/* eslint-disable react/jsx-no-bind */
import React, { Component, PropTypes } from 'react';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import ActionList from 'material-ui/svg-icons/action/list';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import { grey800 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Media from 'react-media';
import SearchIcon from 'material-ui/svg-icons/action/search';

import './mobile-nav.scss';
import { routes, screenSizes } from '../utils';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;
const { portraitIPad, portraitIPhone6Plus } = screenSizes;

export default class MobileNav extends Component {

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

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searching: false,
      searchQuery: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
  }

  handleClose({ target }) {
    if (target.dataset.route) {
      this.props.router.transitionTo(target.dataset.route);
    }
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

  handleSearchChange({ target }) {
    this.setState({ searchQuery: target.value });
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    this.props.router.transitionTo(`/search?q=${this.state.searchQuery}`);
  }

  handleSearchToggle() {
    this.setState(({ searching }) => ({
      searching: !searching
    }));
  }

  renderSearchHeader() {
    const { searching } = this.state;
    const marginTop = '14px';

    return (
      <span
        id="MobileNav-searchHeader"
        onTouchTap={this.handleSearchToggle}
        style={{
          marginTop
        }}
      >
        {searching &&
          <Media query={{ minWidth: portraitIPhone6Plus.width + 1, maxWidth: portraitIPad.width }} render={() => (
            <form onSubmit={this.handleSearchSubmit}>
              <input
                autoFocus
                onChange={this.handleSearchChange}
                placeholder="User Search"
                style={{ fontSize: '14px', marginRight: '4px' }}
              />
            </form>
            )}
          />
        }
        <SearchIcon
          style={{ color: 'white', marginRight: '4px' }}
        />
      </span>
    );
  }

  render() {
    const style = {
      backgroundColor: grey800
    };
    const visibleRoutes = getVisibleMainRoutesForUser(this.props.user);

    return (
      <span>
        <AppBar
          className="MobileNav"
          iconElementLeft={this.props.user ?
            <IconButton
              onTouchTap={this.handleOpen}
            >
              <ActionList />
            </IconButton> :
            <span />
          }
          iconElementRight={this.renderSearchHeader()}
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
              <IconButton
                onTouchTap={this.handleClose}
              >
                <ActionHighlightOff />
              </IconButton>
              <List>
                <ListItem>
                  <span data-route="/" onTouchTap={this.handleClose}>Home</span>
                </ListItem>
                {visibleRoutes.map((key) =>
                  <span key={key}>
                    <Divider />
                    <ListItem
                      nestedItems={mainRoutes[key].links.filter((route) => canUserSeeLink(route, this.props.user)).map((route) =>
                        <ListItem key={route.path}>
                          <span data-route={route.path} onTouchTap={this.handleClose}>{route.name}</span>
                        </ListItem>
                      )}
                      primaryText={mainRoutes[key].displayName}
                      primaryTogglesNestedList
                    />
                  </span>
                )}
                <Divider />
                <ListItem
                  onTouchTap={this.handleLogout}
                  primaryText="Logout"
                />
              </List>
            </Drawer>
          }
        </AppBar>
        {this.state.searching &&
          <Media query={{ maxWidth: portraitIPhone6Plus.width }} render={() => (
            <form onSubmit={this.handleSearchSubmit}>
              <input
                autoFocus
                id="MobileNav-searchInput"
                onChange={this.handleSearchChange}
                placeholder="User Search"
              />
            </form>
            )}
          />
        }
      </span>
    );
  }
}
