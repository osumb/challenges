/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import ListIcon from '../../../assets/images/ic_list_white_36px.svg';
import Media from 'react-media';
import pick from 'lodash.pick';
import SearchIcon from '../../../assets/images/ic_search_white_36px.svg';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { lightGray } from '../../../styles';
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
const { portraitIPad } = screenSizes;
const userProps = ['role'];
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 60px;
`;
const HeaderInput = styled.input`
  border-radius: 4px;
  font-size: 14px;
  margin-right: 2px;
  border: 1px solid ${lightGray};
  padding: 4px;
  transition: all 0.1s ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};

  &:focus {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 1px solid rgba(81, 203, 238, 1);
  }

  &:active {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 1px solid rgba(81, 203, 238, 1);
  }
`;
const SearchHeader = styled.span`
  display: flex;
  align-items: center;
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
      <Media
        query={{
          minWidth: portraitIPad.width - 1,
          maxWidth: portraitIPad.width
        }}
        render={() => (
          <SearchHeader>
            <form onSubmit={this.handleSearchSubmit}>
              <HeaderInput
                visible={searching}
                onChange={this.handleSearchChange}
                placeholder="User Search"
              />
            </form>
            <Button onClick={this.handleSearchToggle}>
              <img
                src={SearchIcon}
                style={{ color: 'white' }}
                alt="Search Icon"
              />
            </Button>
          </SearchHeader>
        )}
      />
    );
  }

  render() {
    const separatorMargin = '0',
      separatorPadding = '0';
    const { user } = this.props;
    const { open } = this.state;
    const visibleMainRoutes = getVisibleMainRoutesForUser(user);
    const linkDropDowns = visibleMainRoutes.map(key => {
      const dropdownChildren = mainRoutes[key].links
        .filter(link => canUserSeeLink(link, user))
        .map(route => (
          <span key={route.path} data-route={route.path}>
            &nbsp;&nbsp;&nbsp;&nbsp;{route.name}
          </span>
        ));

      return (
        <ListDropdown
          key={key}
          header={key}
          separatorMargin={separatorMargin}
          separatorPadding={separatorPadding}
        >
          {dropdownChildren}
        </ListDropdown>
      );
    });

    return (
      <Container>
        <ToolBar
          className="MobileNav"
          iconElementLeft={
            !isEmptyObject(user) ? (
              <Button onClick={this.handleOpen}>
                <img src={ListIcon} alt="List Icon" />
              </Button>
            ) : null
          }
          iconElementRight={
            helpers.isAdmin(user) ? this.renderSearchHeader() : null
          }
          altTitle="&nbsp;Challenges&nbsp;"
          title="&nbsp;OSUMB Challenges&nbsp;"
        />
        {!isEmptyObject(user) && (
          <Drawer
            header="Challenges"
            onClick={this.handleDrawerClick}
            onCloseRequest={this.handleDrawerCloseRequest}
            open={open}
          >
            <span data-route="/">Home</span>
            <ListDropdownSeparator
              key="separator"
              margin={separatorMargin}
              padding={separatorPadding}
            />
            {linkDropDowns}
            <ListDropdownItem>
              <span data-route="/logout">Logout</span>
            </ListDropdownItem>
          </Drawer>
        )}
      </Container>
    );
  }
}
