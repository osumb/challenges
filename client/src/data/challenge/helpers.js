/* eslint-disable indent */
import { auth, api } from '../../utils';
import { helpers as spotHelpers } from '../spot';
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

const csvHeader = ['Challenged Spot', '', 'Name', 'Spot', 'Place', 'Comments'];
/* Each challenge will look like this:
 * Challenged Spot, , Name, Spot, Place, Comments
 * A4, , Bob, A13, 1, Did great
 * A4, , Alice, A4, 2, Didn't do as great
 */
const challengeToCSVRows = challenge => {
  const { userChallenges, users, spot } = challenge;
  const mappedUserChallenges = users.map(({ buckId }) =>
    userChallenges.find(({ userBuckId }) => userBuckId === buckId)
  );
  const spotString = spotHelpers.toString(spot);

  return users.map((user, index) =>
    [
      spotString,
      '',
      userHelpers.fullName(user),
      spotHelpers.toString(mappedUserChallenges[index].spot),
      mappedUserChallenges[index].place,
      mappedUserChallenges[index].comments.replace(',', ';')
    ].join(',')
  );
};

const getCompleted = () => api.get('/challenges/completed');
const getForApproval = () => api.get('/challenges/for_approval');
const isNormalChallenge = challengeType => challengeType === 'normal';
const isOpenSpotChallenge = challengeType => challengeType === 'open_spot';
const isTriChallenge = challengeType => challengeType === 'tri';

export default {
  addUser,
  challengeToCSVRows,
  create,
  csvHeader,
  getCompleted,
  getForApproval,
  isNormalChallenge,
  isOpenSpotChallenge,
  isTriChallenge
};
