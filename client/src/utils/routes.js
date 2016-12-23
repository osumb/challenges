export const ADMIN = 'ADMIN';
export const ANY = 'ANY';
export const HOME = 'Home';
export const SQUAD_LEADER = 'SQUAD_LEADER';

export const canUserSeeLink = (link, user = {}) =>
  link.roles.includes(ANY) ||
  (user.squadLeader && link.roles.some((role) => role === SQUAD_LEADER)) ||
  (user.admin && link.roles.some((role) => role === ADMIN));

export const canUserAccessPattern = (user, pattern) => {
  if (typeof user === 'undefined' || user === null) {
    return false;
  }

  if (pattern === '/') {
    return true;
  }

  const patternMainRouteKey = Object.keys(mainRoutes).find((key) => mainRoutes[key].links.some(({ path }) => path === pattern));

  if (!patternMainRouteKey) {
    return false;
  }

  const link = mainRoutes[patternMainRouteKey].links.find(({ path }) => path === pattern);
  const { roles } = link;

  return roles.includes(ANY) || (user.squadLeader && roles.includes(SQUAD_LEADER)) || (user.admin && roles.includes(ADMIN));
};

export const getVisibleMainRoutesForUser = (user) => {
  if (typeof user === 'undefined' || user === null) {
    return [];
  }

  return Object.keys(mainRoutes).filter((key) => mainRoutes[key].links.some((link) => canUserSeeLink(link, user)));
};

export const mainRoutes = {
  challenges: {
    displayName: 'Challenges',
    links: [
      {
        name: 'Previous',
        path: '/challenges',
        roles: [ANY]
      },
      {
        name: 'Make A Challenge',
        path: '/challenges/new',
        roles: [ANY]
      },
      {
        name: 'Evaluate',
        path: '/challenges/evaluate',
        roles: [ADMIN, SQUAD_LEADER]
      }
    ]
  },
  results: {
    displayName: 'Results',
    links: [
      {
        name: 'Completed',
        path: '/results/completed',
        roles: [ANY]
      },
      {
        name: 'Edit',
        path: '/results/edit',
        roles: [ADMIN, SQUAD_LEADER]
      }
    ]
  },
  performances: {
    displayName: 'Performances',
    links: [
      {
        name: 'All',
        path: '/performances',
        roles: [ADMIN]
      },
      {
        name: 'Create',
        path: '/performances/new',
        roles: [ADMIN]
      }
    ]
  }
};
