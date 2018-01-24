import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import pick from 'lodash.pick';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { isEmptyObject, routes } from '../../../utils';
import { lightGray } from '../../../styles';
import { propTypes as userPropTypes } from '../../../data/user';
import LinkDropdown from './link-dropdown';

const { canUserSeeLink, getVisibleMainRoutesForUser, mainRoutes } = routes;
const props = ['role'];
const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  background-color: ${lightGray}
  min-height: 48px;
`;
const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
`;
const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default class DesktopNav extends PureComponent {
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
          <LinkWrapper>
            <Link to="/" style={{ color: 'black' }}>
              Home
            </Link>
          </LinkWrapper>
          {visibleRoutes.map(key => (
            <LinkDropdown
              displayName={mainRoutes[key].displayName}
              key={key}
              links={mainRoutes[key].links.filter(link =>
                canUserSeeLink(link, user)
              )}
            />
          ))}
        </LeftContainer>
        {!isEmptyObject(user) && (
          <LinkWrapper onClick={onLogout}>Logout</LinkWrapper>
        )}
      </Container>
    );
  }
}
