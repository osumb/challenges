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
  fetch('/api/token', {
    headers: { // eslint-disable-line quote-props
      Accept: 'application/json, text/html',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({ nameNumber, password })
  })
  .then((response) => {
    if (response.status >= 300) throw new Error(response.status);
    return response.json();
  })
  .then(({ token }) => {
    localStorage.userJWT = token;
  });

const getToken = () => localStorage[LOCAL_STORE_STRING];

const getUser = () => localStorage[LOCAL_STORE_STRING] && jwtDecode(localStorage[LOCAL_STORE_STRING]);

const isAuthenticated = () => {
  const user = getUser();

  if (!user) {
    return false;
  } else if (new Date(user.revokeTokenDate).getTime() > user.iat || user.expires < new Date().getTime()) {
    logout();
    return false;
  }
  return true;
};

const logout = () => {
  localStorage.removeItem(LOCAL_STORE_STRING);
};

const refreshToken = (token) => {
  localStorage.userJWT = token;
};

const userCanAccess = (pattern) =>
  getUser() &&
  (getUser().admin || (!getUser().squadLeader && !SL_ROUTES.includes(pattern)) || !ADMIN_ROUTES.includes(pattern));

export default { authenticate, getToken, getUser, isAuthenticated, logout, refreshToken, userCanAccess };
