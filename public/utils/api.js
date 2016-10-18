import 'whatwg-fetch';

const request = (url, { method, body }) =>
  fetch(`/api${url}`, {
    headers: {
      Accept: 'application/json, text/html',
      Authorization: localStorage.userJWT && `Bearer ${localStorage.userJWT}`
    },
    method,
    body
  })
  .then((response) => {
    if (response.status >= 300) throw new Error(response.status);
    return response.json();
  })
  .catch((err) => {
    console.error(err);
  });

const del = (url) => request(url, { method: 'delete' });
const get = (url) => request(url, { method: 'get' });
const post = (url, body) => request(url, { method: 'post', body });
const put = (url, body) => request(url, { method: 'put', body });

export default { del, get, post, put };
