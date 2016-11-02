import 'whatwg-fetch';
import jwtDecode from 'jwt-decode';

const LOCAL_STORE_STRING = 'userJWT';
const ADMIN_ROUTES = [
  '/performances',
  '/performances/new',
  '/results',
  '/users',
  '/users/search'
];
const SL_ROUTES = [
  '/challenges/evaluate'
];

const authenticate = (nameNumber, password) =>
  fetch(`/api/token?nameNumber=${nameNumber}&password=${password}`, {
    headers: { // eslint-disable-line quote-props
      Accept: 'application/json, text/html',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    if (response.status >= 300) throw new Error(response.status);
    return response.json();
  })
  .then(({ token }) => {
    localStorage.userJWT = token;
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
