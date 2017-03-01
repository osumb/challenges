import 'whatwg-fetch';

import auth from './auth';
import errorEmitter from './error-emitter';

const { getToken, refreshToken } = auth;
const baseRoute = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.SERVER_PORT}`
  : '';

const DEFAULT_ERROR_MESSAGE = 'Sorry! Something wen\'t wrong. We\'re aware of and working on the issue';

const getMessageFromStatus = (status) => {
  /* eslint-disable indent, lines-around-comment */
  switch (status) {
    case 404:
      return 'Sorry, that resource doesn\'t exist';
    case 403:
      return 'That resource is forbidden';
    default:
      return DEFAULT_ERROR_MESSAGE;
  }
};

const headers = () => ({
  'Accept': 'application/json, text/html',
  'Authorization': getToken() && `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
});

const request = (url, { method, body }, errorMessage) =>
  fetch(`${baseRoute}/api${url}`, {
    headers: headers(),
    method,
    mode: 'cors',
    body: JSON.stringify(body)
  })
  .then((response) => {
    if (!response.ok) {
      console.log(response);
      console.log(response.bodyUsed);
      if (response.bodyUsed) {
        console.log('bodyUsed');
        throw response.body();
      }
      throw response;
    }

    return response.json()
    .then(({ token, ...rest }) => {
      if (token) {
        refreshToken(token);
      }
      return rest;
    });
  })
  .catch((response) => {
    console.log(response);
    if (errorMessage) {
      errorEmitter.dispatch(errorMessage);
    } else {
      const { status } = response;

      try {
        response.text()
        .then((responseMessage) => {
          if (responseMessage) {
            errorEmitter.dispatch(responseMessage);
          } else {
            errorEmitter.dispatch(getMessageFromStatus(status));
          }
        });
      } catch (e) {
        errorEmitter.dispatch(getMessageFromStatus(status));
        throw e;
      }
    }
  });

const del = (url, errorMessage) => request(url, { method: 'delete' }, errorMessage);
const get = (url, errorMessage) => request(url, { method: 'get' }, errorMessage);
const post = (url, body, errorMessage) => request(url, { method: 'post', body }, errorMessage);
const put = (url, body, errorMessage) => request(url, { method: 'put', body }, errorMessage);

export default { del, get, post, put };
