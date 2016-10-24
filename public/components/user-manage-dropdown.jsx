import React from 'react';

import Dropdown from './dropdown';

export default function UserManageDropdown() {
  const links = [
    {
      location: '/users',
      name: 'Roster'
    },
    {
      location: '/users/manage',
      name: 'Search'
    }
  ];

  return <Dropdown name="Users" links={links} />;
}
