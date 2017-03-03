import React, { Component, PropTypes } from 'react';
import { grey300 } from 'material-ui/styles/colors';
import { Link } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';
import pick from 'lodash.pick';
import styled from 'styled-components';

import { isEmptyObject, routes } from '../../../utils';
import { propTypes as userPropTypes } from '../../../data/user';
import LinkDropdown from './link-dropdown';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;
const props = ['role'];
const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  background-color: ${grey300}
`;
const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
`;

export default class DesktopNav extends Component {
  static get propTypes() {
    return {
      onLogout: PropTypes.func.isRequired,
      user: PropTypes.shape(pick(userPropTypes, props)).isRequired
    };
  }

  static get props() {
    return props;
  }

  render() {
    const { onLogout, user } = this.props;
    const visibleRoutes = getVisibleMainRoutesForUser(user);

    return (
      <Container>
        <LeftContainer>
          <MenuItem>
            <Link to="/">Home</Link>
          </MenuItem>
          {visibleRoutes.map((key) =>
            <LinkDropdown
              displayName={mainRoutes[key].displayName}
              key={key}
              links={mainRoutes[key].links.filter((link) => canUserSeeLink(link, user))}
            />
          )}
        </LeftContainer>
        {!isEmptyObject(user) &&
          <MenuItem
            onTouchTap={onLogout}
            primaryText="Logout"
          />
        }
      </Container>
    );
  }
}
