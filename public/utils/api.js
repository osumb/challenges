import 'whatwg-fetch';

import { deleteMessage, errorMessage } from './error-message';

const request = (url, { method, body }) =>
  fetch(`/api${url}`, {
    headers: { // eslint-disable-line quote-props
      Accept: 'application/json, text/html',
      Authorization: localStorage.userJWT && `Bearer ${localStorage.userJWT}`,
      'Content-Type': 'application/json'
    },
    method,
    body: JSON.stringify(body)
  })
  .then((response) => {
    if (response.status >= 300) throw response.status;
    deleteMessage();
    return response.json();
  })
  .catch((err) => {
    let errMessage;

    /* eslint-disable indent*/
    switch (err) {
      case 404:
        errMessage = 'Resource not found';
        break;
      case 403:
        errMessage = 'Sorry, that action is forbidden. Make sure the information you send is correct';
        break;
      default:
        errMessage = 'Sorry! There was a problem with your request. We\'re aware of and are working on the issue';
    }
    console.error(err);
    errorMessage(errMessage);
    throw err;
  });

const del = (url) => request(url, { method: 'delete' });
const get = (url) => request(url, { method: 'get' });
const post = (url, body) => request(url, { method: 'post', body });
const put = (url, body) => request(url, { method: 'put', body });

export default { del, get, post, put };
