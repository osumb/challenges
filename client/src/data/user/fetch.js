import { api, auth } from '../../utils';

const all = () => api.get('/users');
const byId = (id) => api.get(`/users/${id || auth.getUser().buckId}`).then(({ user }) => user);

export default { all, byId };
