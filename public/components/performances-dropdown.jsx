import React from 'react';

import Dropdown from './dropdown';

const PerformancesDropdown = () => {
  const links = [
    {
      location: '/performances/new',
      name: 'Create Performance'
    },
    {
      location: '/performances',
      name: 'Edit Performances'
    }
  ];

  return <Dropdown name="Performances" links={links} />;
};

export default PerformancesDropdown;
