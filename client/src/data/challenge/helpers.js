import { api } from '../../utils';

const addUser = (buckId, challengeId) =>
  api.post('/user_challenges', {
    buck_id: buckId,
    challenge_id: challengeId
  });

const create = ({ file, row }) =>
  api.post('/challenges', {
    spot: {
      row,
      file
    }
  });

const del = id => new Promise(resolve => setTimeout(resolve, id));
const isNormalChallenge = challengeType => challengeType === 'normal';
const isOpenSpotChallenge = challengeType => challengeType === 'open_spot';
const isTriChallenge = challengeType => challengeType === 'tri';

export default {
  addUser,
  create,
  del,
  isNormalChallenge,
  isOpenSpotChallenge,
  isTriChallenge
};
