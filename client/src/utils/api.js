import 'whatwg-fetch';

import auth from './auth';

const { getToken, refreshToken } = auth;
const baseRoute = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.SERVER_PORT}`
  : '';

const request = (url, { method, body }) =>
  fetch(`${baseRoute}/api${url}`, {
    headers: { // eslint-disable-line quote-props
      'Accept': 'application/json, text/html',
      'Authorization': getToken() && `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    method,
    body: JSON.stringify(body)
  })
  .then((response) => {
    if (!response.ok) throw response.status;

    return response.json()
    .then(({ token, ...rest }) => {
      if (token) {
        refreshToken(token);
      }
      return rest;
    });
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });

const del = (url) => request(url, { method: 'delete' });
const get = (url) => request(url, { method: 'get' });
const post = (url, body) => request(url, { method: 'post', body });
const put = (url, body) => request(url, { method: 'put', body });

export default { del, get, post, put };
