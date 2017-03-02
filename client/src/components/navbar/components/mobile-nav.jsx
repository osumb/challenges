/* eslint-disable react/jsx-no-bind */
import React, { Component, PropTypes } from 'react';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import ActionList from 'material-ui/svg-icons/action/list';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import { grey800 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Media from 'react-media';
import pick from 'lodash.pick';
import SearchIcon from 'material-ui/svg-icons/action/search';
import styled from 'styled-components';

import './mobile-nav.scss';
import { helpers, propTypes as userPropTypes } from '../../../data/user';
import { isEmptyObject, routes, screenSizes } from '../../../utils';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;
const { portraitIPad, portraitIPhone6Plus } = screenSizes;
const userProps = ['role'];
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 60px;
`;
const HeaderInput = styled.input`
  border-radius: 4px;
  font-size: 14px;
  margin-right: 4px;
`;
const SearchHeader = styled.span`
  display: flex;
  margin-left: -10px;
  margin-top: 14px;
`;
const SearchInput = styled.input`
  font-size: 14px;
  margin-top: 5px;
  position: absolute;
  width: 98%;
`;

export default class MobileNav extends Component {

  static get propTypes() {
    return {
      onLogout: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      user: PropTypes.shape(pick(userPropTypes, userProps)).isRequired
    };
  }

  static get props() {
    return userProps;
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
      this.props.push(target.dataset.route);
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
    this.setState({ searching: false });
    this.props.push(`/search?q=${this.state.searchQuery}`);
  }

  handleSearchToggle() {
    this.setState(({ searching }) => ({
      searching: !searching
    }));
  }

  renderSearchHeader() {
    const { searching } = this.state;

    return (
      <SearchHeader>
        {searching &&
          <Media query={{ minWidth: portraitIPhone6Plus.width + 1, maxWidth: portraitIPad.width }} render={() => (
            <form onSubmit={this.handleSearchSubmit}>
              <HeaderInput
                onChange={this.handleSearchChange}
                placeholder="User Search"
              />
            </form>
            )}
          />
        }
        <FlatButton
          onTouchTap={this.handleSearchToggle}
          rippleColor="None"
        >
          <SearchIcon
            style={{ color: 'white' }}
          />
        </FlatButton>
      </SearchHeader>
    );
  }

  render() {
    const { user } = this.props;
    const { open } = this.state;
    const AppBarStyle = {
      backgroundColor: grey800,
      flex: 1,
      minHeight: '50px'
    };
    const visibleRoutes = getVisibleMainRoutesForUser(user);

    return (
      <Container className="MobileNav-container">
        <AppBar
          className="MobileNav"
          iconElementLeft={!isEmptyObject(user) ?
            <IconButton onTouchTap={this.handleOpen}>
              <ActionList />
            </IconButton>
            : <span />
          }
          iconElementRight={helpers.isAdmin(user) ? this.renderSearchHeader() : null}
          style={AppBarStyle}
          title="OSUMB Challenges"
        >
          {!isEmptyObject(user) &&
            <Drawer
              docked
              onOpenRequest
              open={open}
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
                      nestedItems={mainRoutes[key].links.filter((route) => canUserSeeLink(route, user)).map((route) =>
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
            <form id="MobileNav-searchForm" onSubmit={this.handleSearchSubmit}>
              <SearchInput
                onChange={this.handleSearchChange}
                placeholder="User Search"
              />
            </form>
            )}
          />
        }
      </Container>
    );
  }
}
