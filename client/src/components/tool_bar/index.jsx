import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { screenSizes } from '../../utils';
import { secondaryGray, primaryRed } from '../../styles';
import Typography from '../typography';

const Container = styled.div`
  background-color: ${secondaryGray} !important;
  border-bottom: 6px solid ${primaryRed} !important;
  padding: 40px 0 !important;
  position: relative !important;
  z-index: 0 !important;
`;

export default function ToolBar({
  altTitle = 'Challenges',
  iconElementLeft,
  iconElementRight,
  title
}) {
  return (
    <Container className="mdc-toolbar mdc-toolbar--fixed challenges-toolbar">
      {iconElementLeft && (
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          {iconElementLeft}
        </section>
      )}
      <Media query={{ maxWidth: screenSizes.portraitIPhone6Plus.width }}>
        {matches => (
          <Typography
            className="mdc-toolbar__title"
            category="display"
            number={1}
          >
            {matches ? altTitle : title}
          </Typography>
        )}
      </Media>
      {iconElementRight && (
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          {iconElementRight}
        </section>
      )}
    </Container>
  );
}

ToolBar.propTypes = {
  altTitle: PropTypes.string,
  iconElementLeft: PropTypes.node,
  iconElementRight: PropTypes.node,
  title: PropTypes.string
};
