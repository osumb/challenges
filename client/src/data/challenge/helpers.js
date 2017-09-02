/* eslint-disable indent */
import { auth, api } from '../../utils';
import { helpers as userHelpers } from '../user';

const addUser = (buckId, challengeId) =>
  userHelpers.isAdmin(auth.getUser())
    ? api.post('/user_challenges', {
        challenger_buck_id: buckId,
        challenge_id: challengeId
      })
    : api.post('/user_challenges', {
        challenge_id: challengeId
      });

const approve = id => api.put(`/challenges/${id}/approve`);
const create = ({ file, row }, challenger_buck_id) =>
  userHelpers.isAdmin(auth.getUser())
    ? api.post('/challenges', {
        challenger_buck_id,
        spot: {
          row,
          file
        }
      })
    : api.post('/challenges', {
        spot: {
          row,
          file
        }
      });

const disapprove = id => api.put(`/challenges/${id}/disapprove`);
const getCompleted = () => api.get('/challenges/completed');
const getForApproval = () => api.get('/challenges/for_approval');
const isNormalChallenge = challengeType => challengeType === 'normal';
const isOpenSpotChallenge = challengeType => challengeType === 'open_spot';
const isTriChallenge = challengeType => challengeType === 'tri';

export default {
  addUser,
  approve,
  create,
  disapprove,
  getCompleted,
  getForApproval,
  isNormalChallenge,
  isOpenSpotChallenge,
  isTriChallenge
};
