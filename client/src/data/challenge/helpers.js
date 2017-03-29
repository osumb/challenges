import { api } from '../../utils';

const addUser = (buckId, challengeId) =>
  api.post('/user_challenges', {
    buck_id: buckId,
    challenge_id: challengeId
  });

const create = ({ challengeType, file, performanceId, row }) =>
  api.post('/challenges', {
    challenge_type: challengeType,
    file,
    performance_id: performanceId,
    row
  });

const isNormalChallenge = challengeType => challengeType === 'normal';
const isOpenSpotChallenge = challengeType => challengeType === 'open_spot';
const isTriChallenge = challengeType => challengeType === 'tri';

export default { addUser, create, isNormalChallenge, isOpenSpotChallenge, isTriChallenge };
