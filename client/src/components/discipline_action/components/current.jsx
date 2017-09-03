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
`;

export default function CurrentDisciplineAction({
  allowedToChallenge,
  performance,
  reason
}) {
  const permission = allowedToChallenge ? 'are' : "aren't";
  const performanceStr = `You ${permission} allowed to challenge for the ${performance.name}`;
  const reasonStr = `Reason: ${reason}`;

  return (
    <Elevation>
      <Container>
        <Typography category="headline">
          {performanceStr}
        </Typography>
        <Typography category="headline">
          {reasonStr}
        </Typography>
      </Container>
    </Elevation>
  );
}

CurrentDisciplineAction.propTypes = disciplineActionProps;
