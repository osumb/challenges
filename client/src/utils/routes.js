import { helpers } from '../data/user';
import { isEmptyObject } from '../utils';

const ADMIN = 'ADMIN';
const ANY = 'ANY';
const SQUAD_LEADER = 'SQUADLEADER';

export const canUserSeeLink = (link, user = {}) =>
  link.show &&
  (link.roles.includes(ANY) ||
    (helpers.isSquadLeader(user) &&
      link.roles.some(role => role === SQUAD_LEADER)) ||
    (helpers.isAdmin(user) && link.roles.some(role => role === ADMIN)));

export const canUserAccessPattern = (user, pattern) => {
  if (typeof user === 'undefined' || user === null) {
    return false;
  }

  if (pattern === '/') {
    return true;
  }

  const patternMainRouteKey = Object.keys(mainRoutes).find(key =>
    mainRoutes[key].links.some(({ path }) => path === pattern)
  );

  if (!patternMainRouteKey) {
    return false;
  }

  const link = mainRoutes[patternMainRouteKey].links.find(
    ({ path }) => path === pattern
  );
  const { roles } = link;

  return (
    roles.includes(ANY) ||
    (helpers.isSquadLeader(user) && roles.includes(SQUAD_LEADER)) ||
    (helpers.isAdmin(user) && roles.includes(ADMIN))
  );
};

export const getVisibleMainRoutesForUser = user => {
  if (typeof user === 'undefined' || user === null || isEmptyObject(user)) {
    return [];
  }

  return Object.keys(mainRoutes).filter(key =>
    mainRoutes[key].links.some(link => canUserSeeLink(link, user))
  );
};

export const mainRoutes = {
  challenges: {
    displayName: 'Challenges',
    links: [
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
        path: '/users/:buckId',
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
      },
      {
        name: 'Upload',
        path: '/user/upload',
        roles: [ADMIN],
        show: true
      },
      {
        name: 'Create',
        path: '/user/new',
        roles: [ADMIN],
        show: true
      }
    ]
  }
};
