import 'whatwg-fetch';

import errorMessage from './error-message';

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
    if (response.status >= 300) throw new Error(response.status);
    return response.json();
  })
  .catch((err) => {
    console.error(err);
    errorMessage('Sorry! There was a problem with your request. We\'re aware of and are working on the issue');
  });

const del = (url) => request(url, { method: 'delete' });
const get = (url) => request(url, { method: 'get' });
const post = (url, body) => request(url, { method: 'post', body });
const put = (url, body) => request(url, { method: 'put', body });

export default { del, get, post, put };
