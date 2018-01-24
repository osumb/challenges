import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { propTypes } from '../../../../data/user';
import DownloadIcon from '../../../../assets/images/ic_file_download_black_24px.svg';
import Typography from '../../../../components/typography';

const userToCsv = ({ firstName, instrument, lastName, part, spot }) =>
  `${firstName} ${lastName},${spot},${part},${instrument}`;

const usersToCsv = users =>
  ['data:text/csv;charset=utf-8,', 'Name,Spot,Part,Instrument']
    .concat(users.map(userToCsv))
    .join('\n');

const Container = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const Download = styled.img`
  margin-left: 10px;
`;

const handleDownLoadClick = users => () => {
  const csv = usersToCsv(users);
  const uri = encodeURI(csv);
  const link = document.createElement('a');

  link.setAttribute('href', uri);
  link.setAttribute('download', 'roster.csv');
  document.body.appendChild(link);

  link.click();
  link.remove();
};

export default function RosterHeader({ users }) {
  return (
    <Container>
      <Typography category="display" number={2}>
        Member Roster
      </Typography>
      <Download src={DownloadIcon} onClick={handleDownLoadClick(users)} />
    </Container>
  );
}

RosterHeader.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({ ...propTypes, spot: PropTypes.string })
  )
};
