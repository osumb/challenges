import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { helpers, propTypes as performancePropTypes } from '../../data/performance';
import { isEmptyObject } from '../../utils';
import Typography from '../../components/typography';

const strFormat = 'MMM, Do h:mm A';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function PerformanceWindow(performance) {
  if (performance === null || typeof performance === 'undefined' || isEmptyObject(performance)) {
    return (
      <Container>
        <Typography category="title">There is no upcoming performance in the system</Typography>
      </Container>
    );
  }

  if (helpers.isWindowOpen(performance)) {
    return (
      <Container>
        <Typography category="display" number={1}>{performance.name} challenges are now open!</Typography>
        <Typography category="title">The window closes at {moment(performance.windowClose).format(strFormat)}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography category="title">
        Challenge signups for {performance.name} open at&nbsp;
        {moment(performance.windowOpen).format(strFormat)} and close at&nbsp;
        {moment(performance.windowClose).format(strFormat)}
      </Typography>
    </Container>
  );
}

PerformanceWindow.propTypes = performancePropTypes.performance;
