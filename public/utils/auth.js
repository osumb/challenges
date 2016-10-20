import jwtDecode from 'jwt-decode';

import { api } from '../utils';

const LOCAL_STORE_STRING = 'userJWT';
const ADMIN_ROUTES = [
  '/performances',
  '/performances/new',
  '/results'
];
const SL_ROUTES = [
  '/challenges/evaluate'
];

const authenticate = (nameNumber, password) =>
  api.get(`/token?nameNumber=${nameNumber}&password=${password}`)
  .then(({ token }) => {
    localStorage.userJWT = token;
    return;
  });

const getUser = () => localStorage[LOCAL_STORE_STRING] && jwtDecode(localStorage[LOCAL_STORE_STRING]);

const isAuthenticated = () => typeof getUser() !== 'undefined';

const logout = () => {
  localStorage.removeItem(LOCAL_STORE_STRING);
};

const userCanAccess = (pattern) =>
  getUser() &&
  (getUser().admin || (!getUser().squadLeader && !SL_ROUTES.includes(pattern)) || !ADMIN_ROUTES.includes(pattern));

export default { authenticate, getUser, isAuthenticated, logout, userCanAccess };
