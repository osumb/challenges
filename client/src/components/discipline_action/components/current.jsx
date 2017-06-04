import React from 'react';
import styled from 'styled-components';

import { propTypes as disciplineActionProps } from '../../../data/discipline_action';
import Elevation from '../../elevation';
import Typography from '../../typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

export default function CurrentDisciplineAction({ reason, allowedToChallenge, performance }) {
  const performanceStr = `Your spot was opened for the ${performance.name}`;
  const reasonStr = `Reason: ${reason}`;

  return (
    <Elevation>
      <Container>
        <Typography category="headline">{performanceStr}</Typography>
        <Typography category="headline">{reasonStr}</Typography>
        {allowedToChallenge &&
          <Typography category="title">You are allowed to make a challenge</Typography>
        }
      </Container>
    </Elevation>
  );
}

CurrentDisciplineAction.propTypes = disciplineActionProps;
