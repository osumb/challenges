import React from 'react';

import Dropdown from './dropdown';

const ResultsDropdown = () => {
  const links = [
    {
      location: '/results/toApprove',
      name: 'Approve Results'
    },
    {
      location: '/results',
      name: 'Past Results'
    }
  ];

  return <Dropdown name="Results" links={links} />;
};

export default ResultsDropdown;
