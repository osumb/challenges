import { api, auth } from '../../utils';

const ADMIN = 'Admin';
const DIRECTOR = 'Director';
const MEMBER = 'Member';
const SQUAD_LEADER = 'SquadLeader';

const getAll = () => api.get('/users');
const getById = id => api.get(`/users/${id || auth.getUser().buckId}`);
const getProfile = () => api.get(`/users/profile/${auth.getUser().buckId}`);
const isAdmin = ({ role }) => role === ADMIN;
const isDirector = ({ role }) => role === DIRECTOR;
const isMember = ({ role }) => role === MEMBER;
const isSquadLeader = ({ role }) => role === SQUAD_LEADER;
const isTriChallengeUser = ({ spot }) => ['J'].includes(spot.row);
const resetPassword = (password_reset_request_id, password, { id }) => api.post(`/users/${id}/reset_password`, { password_reset_request_id, password });

export default {
  getAll,
  getById,
  getProfile,
  isAdmin,
  isDirector,
  isMember,
  isSquadLeader,
  isTriChallengeUser,
  resetPassword
};
