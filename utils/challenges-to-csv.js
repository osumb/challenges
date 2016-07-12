const challengesToCSV = challenges => {
  return challenges.map(({ challengee, challenger, challengeespot, challengerspot, spotopen }) => {
    const challengeeString = spotopen ? 'Open Spot' : challengee;

    return [challengerspot, challenger, challengeespot, challengeeString];
  });
};

module.exports = challengesToCSV;
