import { api, auth } from '../../utils';

const all = () => api.get('/users');
const byId = (id) => api.get(`/users/${id || auth.getUser().buckId}`);
const profile = () => api.get(`/users/profile/${auth.getUser().buckId}`);

export default { all, byId, profile };
