export const ADMIN = 'ADMIN';
export const ANY = 'ANY';
export const HOME = 'Home';
export const SQUAD_LEADER = 'SQUAD_LEADER';

export const canUserSeeLink = (link, user = {}) =>
  link.roles.includes(ANY) ||
  (user.squadLeader && link.roles.some((role) => role === SQUAD_LEADER)) ||
  (user.admin && link.roles.some((role) => role === ADMIN));

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
        name: 'Make A Challenges',
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
        name: 'Previous',
        path: '/results',
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
