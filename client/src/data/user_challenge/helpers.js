import { api } from '../../utils';

const del = id => api.del(`/user_challenges/${id}`);
const rankingFromPlace = place => {
  if (place === 1) return '1st';
  if (place === 2) return '2nd';
  if (place === 3) return '3rd';
  return null;
};

export default { del, rankingFromPlace };
