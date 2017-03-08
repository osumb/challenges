import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { helpers, propTypes as performancePropTypes } from '../../data/performance';
import { isEmptyObject } from '../../utils';

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
        <h2 className="mdc-typography--title">There is no upcoming performance in the system</h2>
      </Container>
    );
  }

  if (helpers.isWindowOpen(performance)) {
    return (
      <Container>
        <h2 className="mdc-typography--display1">{performance.name} challenges are now open!</h2>
        <h2 className="mdc-typography--title mdc-typography--adjust-margin">The window closes at {moment(performance.windowClose).format(strFormat)}</h2>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mdc-typography--title">
        Challenge signups for {performance.name} open at&nbsp;
        {moment(performance.windowOpen).format(strFormat)} and close at&nbsp;
        {moment(performance.windowClose).format(strFormat)}
      </h2>
    </Container>
  );
}

PerformanceWindow.propTypes = performancePropTypes;
