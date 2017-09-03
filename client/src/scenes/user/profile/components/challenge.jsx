import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { propTypes as userChallengeProps } from '../../../../data/user_challenge';
import { propTypes as spotProps } from '../../../../data/spot';
import Elevation from '../../../../components/elevation';
import Typography from '../../../../components/typography';
import UserChallenge from '../../../../components/user_challenge';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Challenge({ performanceName, spot, userChallenge }) {
  return (
    <Elevation style={{ margin: 4 }}>
      <Container>
        <Header>
          <Typography category="display" number={1}>{performanceName}</Typography>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <Typography category="display" number={1}>{spot.row}{spot.file}</Typography>
        </Header>
        <UserChallenge
          {...userChallenge}
          hideName={true}
          style={{
            width: '100%'
          }}
        />
      </Container>
    </Elevation>
  );
}

Challenge.propTypes = {
  performanceName: PropTypes.string.isRequired,
  spot: PropTypes.shape(spotProps).isRequired,
  userChallenge: PropTypes.shape(userChallengeProps).isRequired
};
