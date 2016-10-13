import React, { PropTypes } from 'react';

import Dropdown from './dropdown';

const ChallengesDropdown = ({ admin }) => {
  const links = [
    {
      location: '/challenges/new',
      name: 'Make A Challenge'
    },
    {
      location: '/challenges/evaluate',
      name: 'Evaluate Challenges'
    }
  ];

  if (admin) {
    links.push({
      location: '/challenges',
      name: 'Previous Challenges'
    });
  }

  return <Dropdown name="Challenges" links={links} />;
};

ChallengesDropdown.propTypes = {
  admin: PropTypes.bool.isRequired
};

export default ChallengesDropdown;
