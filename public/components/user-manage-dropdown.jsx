import React from 'react';

import Dropdown from './dropdown';

export default function UserManageDropdown() {
  const links = [
    {
      location: '/users',
      name: 'Roster'
    },
    {
      location: '/users/search',
      name: 'Search'
    }
  ];

  return <Dropdown name="Users" links={links} />;
}
