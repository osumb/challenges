const ContentType = 'Content-Type';
const json = 'json';

const isJSONResponse = response =>
  response.headers &&
  response.headers.has &&
  response.headers.has(ContentType) &&
  response.headers.get(ContentType).includes(json);

export default {
  isJSONResponse
};
