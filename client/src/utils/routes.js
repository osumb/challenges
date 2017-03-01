export const ADMIN = 'ADMIN';
export const ANY = 'ANY';
export const HOME = 'Home';
export const SQUAD_LEADER = 'SQUADLEADER';

export const canUserSeeLink = (link, user = {}) =>
  link.show &&
  (
    link.roles.includes(ANY) ||
    (user.squadLeader && link.roles.some((role) => role === SQUAD_LEADER)) ||
    (user.admin && link.roles.some((role) => role === ADMIN))
  );

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

  console.log(user);
  return roles.includes(ANY) || (user.role === SQUAD_LEADER && roles.includes(SQUAD_LEADER)) || (user.role === ADMIN && roles.includes(ADMIN));
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
        roles: [ANY],
        show: true
      },
      {
        name: 'Make A Challenge',
        path: '/challenges/new',
        roles: [ANY],
        show: true
      },
      {
        name: 'Evaluate',
        path: '/challenges/evaluate',
        roles: [ADMIN, SQUAD_LEADER],
        show: true
      }
    ]
  },
  results: {
    displayName: 'Results',
    links: [
      {
        name: 'Approve',
        path: '/results/pending',
        roles: [ADMIN],
        show: true
      },
      {
        name: 'Completed',
        path: '/results/completed',
        roles: [ADMIN, SQUAD_LEADER],
        show: true
      }
    ]
  },
  performances: {
    displayName: 'Performances',
    links: [
      {
        name: 'All',
        path: '/performances',
        roles: [ADMIN],
        show: true
      },
      {
        name: 'Create',
        path: '/performances/new',
        roles: [ADMIN],
        show: true
      }
    ]
  },
  users: {
    displayName: 'Users',
    links: [
      {
        path: '/users/:nameNumber',
        roles: [ADMIN],
        show: false
      },
      {
        name: 'Search',
        path: '/search',
        roles: [ADMIN],
        show: true
      },
      {
        name: 'Roster',
        path: '/roster',
        roles: [ADMIN],
        show: true
      }
    ]
  }
};
