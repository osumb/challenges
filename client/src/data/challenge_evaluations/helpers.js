import { api } from '../../utils';

const reduceUserChallengesToIdAndField = (challenge, field) =>
  Object.values(challenge.userChallenges).reduce(
    (userChallenges, userChallenge) => [
      ...userChallenges,
      {
        id: userChallenge.id,
        [field]: userChallenge[field]
      }
    ],
    []
  );

const getEvaluableChallenges = () => api.get('/challenges/for_evaluation');
const postSaveComments = challenge =>
  api.post(
    '/user_challenges/comments',
    {
      user_challenges: reduceUserChallengesToIdAndField(challenge, 'comments')
    },
    `Comments were not able to be saved for ${challenge.spot.row}${challenge
      .spot.file}'s challenge'`
  );
const postSavePlaces = challenge =>
  api.post(
    '/user_challenges/places',
    { user_challenges: reduceUserChallengesToIdAndField(challenge, 'place') },
    `Places were not able to be saved for ${challenge.spot.row}${challenge.spot
      .file}'s challenge'`
  );
const putSubmitForEvaluation = challenge =>
  api.put(
    `/challenges/${challenge.id}/submit_for_approval`,
    {},
    `${challenge.spot.row}${challenge.spot
      .file}'s challenge was not able to be submitted for approval`
  );

export default {
  getEvaluableChallenges,
  postSaveComments,
  postSavePlaces,
  putSubmitForEvaluation
};
