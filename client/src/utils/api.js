import 'whatwg-fetch';

import auth from './auth';
import changeCase from './change_case';
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

const request = (url, { method, body }, errorMessage, hideError) =>
  fetch(`${baseRoute}/api${url}`, {
    headers: headers(),
    method,
    mode: 'cors',
    body: JSON.stringify(body)
  })
  .then((response) => {
    if (!response.ok) throw response;
    if (response.status === 204) return response;

    return response.json()
    .then(({ token, ...rest }) => {
      if (token) {
        refreshToken(token);
      }
      return changeCase(rest);
    })
    .catch();
  })
  .catch((response) => {
    if (!hideError) {
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
    } else {
      throw response;
    }
  });

const del = (url, errorMessage, hideError) => request(url, { method: 'delete' }, errorMessage, hideError);
const get = (url, errorMessage, hideError) => request(url, { method: 'get' }, errorMessage, hideError);
const post = (url, body, errorMessage, hideError) => request(url, { method: 'post', body }, errorMessage, hideError);
const put = (url, body, errorMessage, hideError) => request(url, { method: 'put', body }, errorMessage, hideError);

export default { del, get, post, put };
