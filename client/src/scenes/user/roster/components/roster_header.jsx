import React from 'react';
import styled from 'styled-components';

import { propTypes } from '../../../../data/user';
import Typography from '../../../../components/typography';

const Container = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const DownloadIcon = styled.div`
  align-self: flex-end;
`;

export default function RosterHeader({ users }) {
  return (
    <Container>
      <Typography category="display" number={2}>Member Roster</Typography>
      <DownloadIcon>download</DownloadIcon>
    </Container>
  );
}

RosterHeader.propTypes = {
  users: React.PropTypes.arrayOf(React.PropTypes.shape({ ...propTypes, spot: React.PropTypes.string }))
};
