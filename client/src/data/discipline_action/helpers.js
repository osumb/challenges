import { api } from '../../utils';

const create = (allowed_to_challenge, open_spot, performance_id, reason, user_buck_id) =>
  api.post('/discipline_actions', {
    allowed_to_challenge,
    open_spot,
    performance_id,
    reason,
    user_buck_id
  })
;
const del = id => api.del(`/discipline_actions/${id}`);
const get = (id) => api.get(`/discipline_actions/${id}`);

export default { create, del, get };
