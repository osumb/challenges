/* eslint-disable quotes */
import auth from './auth';
import changeCase from './change_case';
import errorEmitter from './error-emitter';
import headersHelpers from './headers';

const { getToken, refreshToken } = auth;
const baseRoute = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.REACT_APP_SERVER_PORT}`
  : '';

const defaultErrorMessage = () =>
  "Sorry! Something wen't wrong. We're aware of and working on the issue";

const parseErrorMessage = response => {
  if (headersHelpers.isJSONResponse(response)) {
    return response
      .json()
      .then(thing => {
        if (thing.message === 'Expired Token') {
          auth.logout();
          return 'Sorry, your session has expired. Please log back in';
        }
        if ((thing.errors || []).length <= 0) {
          return getMessageFromStatus(response.status);
        }
        if (!Array.isArray(thing.errors)) {
          return Object.keys(thing.errors)
            .map(key => `${key}: ${thing.errors[key].join('. ')}`)
            .join('. ');
        }
        return thing.errors.map(error => Object.values(error)).join('. ');
      })
      .catch(err => {
        console.error(err);
        return defaultErrorMessage();
      });
  } else {
    return new Promise(resolve =>
      resolve(getMessageFromStatus(response.status))
    );
  }
};
const handleResponseJSON = ({ jwt, ...rest }) => {
  if (jwt) {
    refreshToken(jwt);
  }
  return changeCase(rest);
};

const getMessageFromStatus = status => {
  /* eslint-disable indent, lines-around-comment */
  switch (status) {
    case 404:
      return "Sorry, that resource doesn't exist";
    case 403:
      return 'That resource is forbidden';
    default:
      return defaultErrorMessage();
  }
};

const headers = () => ({
  Accept: 'application/json, text/html',
  Authorization: getToken() && `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
});

const multipartHeaders = () => ({
  Accept: 'application/json, text/html',
  Authorization: getToken() && `Bearer ${getToken()}`
});

const request = (url, { method, body }, errorMessage, hideError) =>
  fetch(`${baseRoute}/api${url}`, {
    headers: headers(),
    method,
    mode: 'cors',
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) throw response;
      if (!headersHelpers.isJSONResponse(response)) return response.status;

      return response.json().then(handleResponseJSON);
    })
    .catch(response => {
      if (hideError) {
        throw response;
      }
      if (errorMessage) {
        errorEmitter.dispatch(errorMessage);
      } else {
        parseErrorMessage(response).then(message =>
          errorEmitter.dispatch(message)
        );
      }
      throw response.status;
    });

const multipartFormRequest = (url, { method, body }, errorMessage, hideError) =>
  fetch(`${baseRoute}/api${url}`, {
    method,
    body: Object.keys(body).reduce((acc, key) => {
      acc.append(key, body[key]);
      return acc;
    }, new FormData()),
    headers: multipartHeaders(),
    mode: 'cors'
  })
    .then(response => {
      if (!response.ok) throw response;
      if (!headersHelpers.isJSONResponse(response)) return response.status;

      return response.json().then(handleResponseJSON);
    })
    .catch(response => {
      if (hideError) {
        throw response;
      }
      if (errorMessage) {
        errorEmitter.dispatch(errorMessage);
      } else {
        parseErrorMessage(response).then(message =>
          errorEmitter.dispatch(message)
        );
      }
      throw response.status;
    });

const del = (url, errorMessage, hideError) =>
  request(url, { method: 'delete' }, errorMessage, hideError);
const get = (url, errorMessage, hideError) =>
  request(url, { method: 'get' }, errorMessage, hideError);
const post = (url, body, errorMessage, hideError) =>
  request(url, { method: 'post', body }, errorMessage, hideError);
const put = (url, body, errorMessage, hideError) =>
  request(url, { method: 'put', body }, errorMessage, hideError);
const postFormData = (url, body, errorMessage, hideError) =>
  multipartFormRequest(url, { method: 'POST', body }, errorMessage, hideError);

export default { del, get, post, postFormData, put };
