import React, { PropTypes } from 'react';

import Dropdown from './dropdown';

const ChallengesDropdown = ({ admin, squadLeader }) => {
  const links = [
    {
      location: '/challenges/new',
      name: 'Make A Challenge'
    }
  ];

  if (admin || squadLeader) {
    links.push({
      location: '/challenges/evaluate',
      name: 'Evaluate Challenges'
    });
  }

  if (admin) {
    links.push({
      location: '/challenges',
      name: 'See All Challenges'
    });
  }

  return <Dropdown name="Challenges" links={links} />;
};

ChallengesDropdown.propTypes = {
  admin: PropTypes.bool.isRequired,
  squadLeader: PropTypes.bool.isRequired
};

export default ChallengesDropdown;
