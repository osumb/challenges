import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import styles from '../../../../styles';
import Typography from '../../../../components/typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ConfirmMessage = ({
  currentFirstName,
  currentLastName,
  newFirstName,
  newLastName,
  spotString
}) =>
  <Container>
    <Typography category="title">
      Are you sure you want to add {newFirstName} {newLastName}?
    </Typography>
    <Typography category="title">
      Their spot will be: {spotString}
    </Typography>
    <Typography category="title">
      Doing so will make {currentFirstName} {currentLastName} (the current{' '}
      {spotString}) inactive.
    </Typography>
    <Typography category="title" style={{ color: styles.primaryRed }}>
      {currentFirstName} will be replaced and this action cannot be undone.
    </Typography>
  </Container>;

ConfirmMessage.propTypes = {
  currentFirstName: PropTypes.string.isRequired,
  currentLastName: PropTypes.string.isRequired,
  newFirstName: PropTypes.string.isRequired,
  newLastName: PropTypes.string.isRequired,
  spotString: PropTypes.string.isRequired
};

export default ConfirmMessage;
