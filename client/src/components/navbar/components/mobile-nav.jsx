/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import ListIcon from '../../../../public/images/ic_list_white_36px.svg';
import Media from 'react-media';
import pick from 'lodash.pick';
import SearchIcon from '../../../../public/images/ic_search_white_36px.svg';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from '../../button';
import ToolBar from '../../tool_bar';
import Drawer from '../../drawer';
import {
  ListDropdown,
  ListDropdownItem,
  ListDropdownSeparator
} from '../../list_dropdown';

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
`;
const SearchInput = styled.input`
  font-size: 14px;
  margin-top: 5px;
  position: absolute;
  width: 98%;
`;

export default class MobileNav extends PureComponent {
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
    this.handleDrawerClick = this.handleDrawerClick.bind(this);
    this.handleDrawerCloseRequest = this.handleDrawerCloseRequest.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
  }

  handleDrawerClick(e) {
    e.preventDefault();
    if (e.target.dataset.route) {
      this.setState({ open: false });
      if (e.target.dataset.route !== '/logout') {
        this.props.push(e.target.dataset.route);
      } else {
        this.props.onLogout();
      }
    }
  }

  handleDrawerCloseRequest() {
    this.setState({
      open: false
    });
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
          <Media
            query={{
              minWidth: portraitIPhone6Plus.width + 1,
              maxWidth: portraitIPad.width
            }}
            render={() =>
              <form onSubmit={this.handleSearchSubmit}>
                <HeaderInput
                  onChange={this.handleSearchChange}
                  placeholder="User Search"
                />
              </form>}
          />}
        <Button onClick={this.handleSearchToggle}>
          <img src={SearchIcon} style={{ color: 'white' }} />
        </Button>
      </SearchHeader>
    );
  }

  render() {
    const { user } = this.props;
    const { open } = this.state;
    const visibleMainRoutes = getVisibleMainRoutesForUser(user);
    const linkDropDowns = visibleMainRoutes.map(key => {
      const dropdownChildren = mainRoutes[key].links
        .filter(link => canUserSeeLink(link, user))
        .map(route =>
          <span key={route.path} data-route={route.path}>
            &nbsp;&nbsp;&nbsp;&nbsp;{route.name}
          </span>
        );

      return (
        <ListDropdown key={key} header={key}>{dropdownChildren}</ListDropdown>
      );
    });

    return (
      <Container>
        <ToolBar
          className="MobileNav"
          iconElementLeft={
            !isEmptyObject(user)
              ? <Button onClick={this.handleOpen}>
                  <img src={ListIcon} />
                </Button>
              : <span />
          }
          iconElementRight={
            helpers.isAdmin(user) ? this.renderSearchHeader() : null
          }
          title="OSUMB Challenges&nbsp;"
        />
        {!isEmptyObject(user) &&
          <Drawer
            header="Challenges"
            onClick={this.handleDrawerClick}
            onCloseRequest={this.handleDrawerCloseRequest}
            open={open}
          >
            <ListDropdownItem>
              <span data-route="/">Home</span>
            </ListDropdownItem>
            <ListDropdownSeparator key="separator" />
            {linkDropDowns}
            <ListDropdownItem>
              <span data-route="/logout">Logout</span>
            </ListDropdownItem>
          </Drawer>}
        {this.state.searching &&
          <Media
            query={{ maxWidth: portraitIPhone6Plus.width }}
            render={() =>
              <form
                id="MobileNav-searchForm"
                onSubmit={this.handleSearchSubmit}
              >
                <SearchInput
                  onChange={this.handleSearchChange}
                  placeholder="User Search"
                />
              </form>}
          />}
      </Container>
    );
  }
}
