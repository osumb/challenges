import jwtDecode from 'jwt-decode';

import * as routes from './routes';

const LOCAL_STORE_STRING = 'userJWT';
const url = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.SERVER_PORT}`
  : '';

const authenticate = (buck_id, password) =>
  fetch(`${url}/api/user_token`, {
    headers: {
      Accept: 'application/json, text/html', // eslint-disable-line quote-props
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({ auth: { buck_id, password } })
  })
  .then((response) => {
    if (response.status >= 300) throw new Error(response.status);
    return response.json();
  })
  .then(({ jwt }) => {
    localStorage[LOCAL_STORE_STRING] = jwt;
  });

const canUserAccess = (pattern) => routes.canUserAccessPattern(getUser(), pattern);

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

export default { authenticate, canUserAccess, getToken, getUser, isAuthenticated, logout, refreshToken };
