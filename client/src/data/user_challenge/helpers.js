import { api } from '../../utils';

const del = id => api.del(`/user_challenges/${id}`);

export default { del };
