import moment from 'moment';

import { api } from '../../utils';

const endPoint = '/password_reset_requests';

const create = (buck_id, email) =>
  api.post(endPoint, { buck_id, email }, null, true);
const expired = expires => moment(expires).isBefore(moment());
const get = id =>
  api
    .get(`${endPoint}/${id}`)
    .then(({ passwordResetRequest }) => passwordResetRequest);

export default {
  create,
  expired,
  get
};
