import 'whatwg-fetch';

import auth from './auth';
import errorEmitter from './error-emitter';

const { getToken, refreshToken } = auth;
const baseRoute = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.SERVER_PORT}`
  : '';


const request = (url, { method, body }, errorMessage) =>
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
    if (!response.ok) throw response;

    return response.json()
    .then(({ token, ...rest }) => {
      if (token) {
        refreshToken(token);
      }
      return rest;
    });
  })
  .catch((response) => {
    if (errorMessage) {
      errorEmitter.dispatch(errorMessage);
    } else {
      const { status } = response;
      let message = 'Sorry! Something wen\'t wrong. We\'re aware of and working on the issue';

      response.text()
      .then((responseMessage) => {
        if (responseMessage) {
          errorEmitter.dispatch(responseMessage);
        } else {
          /* eslint-disable indent, lines-around-comment */
          switch (status) {
            case 404:
              message = 'Sorry, that resource doesn\'t exist';
              break;
            case 403:
              message = 'That resource is forbidden';
              break;
            default:
              message = errorMessage || message;
          }

          errorEmitter.dispatch(message);
        }
      });
    }
  });

const del = (url, errorMessage) => request(url, { method: 'delete' }, errorMessage);
const get = (url, errorMessage) => request(url, { method: 'get' }, errorMessage);
const post = (url, body, errorMessage) => request(url, { method: 'post', body }, errorMessage);
const put = (url, body, errorMessage) => request(url, { method: 'put', body }, errorMessage);

export default { del, get, post, put };
