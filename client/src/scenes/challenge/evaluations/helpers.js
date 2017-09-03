import { helpers as spotHelpers } from '../../../data/spot';

const reduceToKeyedObjects = inputChallenges =>
  inputChallenges.reduce(
    (challenges, challenge) => ({
      ...challenges,
      [challenge.id]: {
        ...challenge,
        userChallenges: challenge.userChallenges.reduce(
          (userChallenges, userChallenge) => ({
            ...userChallenges,
            [userChallenge.id]: userChallenge
          }),
          {}
        )
      }
    }),
    {}
  );

const sortChallenges = challenges =>
  challenges.sort((a, b) => spotHelpers.compareSpots(a.spot, b.spot));

const switchPlaces = (userChallenges, userChallengeId, place) => {
  const newUserChallenges = { ...userChallenges };
  const withSamePlace = Object.values(newUserChallenges).find(
    uc => uc.place === place
  );
  const currentUserChallenge = newUserChallenges[userChallengeId];

  if (withSamePlace) {
    newUserChallenges[withSamePlace.id].place = currentUserChallenge.place;
  }
  newUserChallenges[userChallengeId].place = place;

  return newUserChallenges;
};

export default {
  reduceToKeyedObjects,
  sortChallenges,
  switchPlaces
};
