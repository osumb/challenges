import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import styled from 'styled-components';

const ClickableA = styled.a`cursor: pointer;`;

const SideNavItem = ({ active, onClick, subtitle, title }) =>
  <ClickableA
    className={classnames('mdc-list-item', {
      'mdc-permanent-drawer--selected': active
    })}
    onClick={onClick}
  >
    <i
      className="material-icons mdc-list-item__start-detail"
      aria-hidden="true"
    >
      {title}
    </i>
    {subtitle}
  </ClickableA>;

SideNavItem.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default SideNavItem;
