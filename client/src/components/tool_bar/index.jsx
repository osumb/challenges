import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { secondaryGray, primaryRed } from '../../styles';

const Container = styled.div`
  background-color: ${secondaryGray} !important;
  border-bottom: 6px solid ${primaryRed} !important;
  padding: 40px 0 !important;
  position: relative !important;
  z-index: 0 !important;
`;

export default function ToolBar({ iconElementLeft, iconElementRight, title }) {
  return (
    <Container className="mdc-toolbar mdc-toolbar--fixed challenges-toolbar">
      {iconElementLeft &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          {iconElementLeft}
        </section>}
      <h2 className="mdc-toolbar__title">{title}</h2>
      {iconElementRight &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          {iconElementRight}
        </section>}
    </Container>
  );
}

ToolBar.propTypes = {
  iconElementLeft: PropTypes.node,
  iconElementRight: PropTypes.node,
  title: PropTypes.string
};
