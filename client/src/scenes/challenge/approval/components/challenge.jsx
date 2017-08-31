/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as styles from '../../../../styles';
import { propTypes } from '../../../../data/challenge_evaluations';
import { FlexContainer } from '../../../../components/flex';
import Button from '../../../../components/button';
import Elevation from '../../../../components/elevation';
import Typography from '../../../../components/typography';
import UserChallenge from '../../../../components/user_challenge';

const UCContainer = styled.div`
  &:not(:first-child) {
    border-left: 1px solid #e0e0e0;
  }
  flex: 1;
  padding: 0 10px;
`;

export default function Challenge({
  id,
  spot,
  onApprove,
  onDisapprove,
  style,
  userChallenges
}) {
  return (
    <Elevation style={{ flex: 1, maxWidth: 600, padding: '0', ...style }}>
      <FlexContainer
        alignItems="center"
        flexDirection="column"
        style={{ height: '100%' }}
      >
        <FlexContainer
          alignItems="center"
          flex={1}
          justifyContent="space-between"
          style={{
            backgroundColor: styles.lightGray,
            boxSizing: 'border-box',
            padding: 10,
            width: '100%'
          }}
        >
          <Typography category="display" number={1}>
            {spot.row}{spot.file}
          </Typography>
          <div>
            <Button onClick={() => onApprove(id)}>Approve</Button>
            <Button onClick={() => onDisapprove(id)} style={{ marginLeft: 4 }}>Disapprove</Button>
          </div>
        </FlexContainer>
        <FlexContainer
          style={{
            boxSizing: 'border-box',
            height: '100%',
            padding: '10px 0',
            width: '100%'
          }}
        >
          {userChallenges.map(uc =>
            <UCContainer key={uc.id}>
              <UserChallenge {...uc} />
            </UCContainer>
          )}
        </FlexContainer>
      </FlexContainer>
    </Elevation>
  );
}

Challenge.propTypes = {
  ...propTypes.challengeForEvaluationPropTypes,
  onApprove: PropTypes.func.isRequired,
  onDisapprove: PropTypes.func.isRequired
};
