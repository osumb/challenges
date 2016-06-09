/* eslint-disable no-undef */
const queryBuilder = require('../utils').db.queryBuilder;
const models = require('../models');
const Challenge = models.Challenge;
const Result = models.Result;
const User = models.User;

describe('UPDATE', () => {
  it('should print the correct results query', () => {
    const needsApproval = true, firstComments = 'test', secondComments = 'blah', spotId = 'R10', winnerId = 'Koop.960', id = 1;
    const attributes = {
      needsApproval,
      firstComments,
      secondComments,
      spotId,
      winnerId
    };
    const { sql, values } = queryBuilder(Result, attributes, {
      statement: 'UPDATE',
      id: 1
    });

    expect(sql).toEqual('UPDATE TABLE results SET needsApproval = $1, firstComments = $2, secondComments = $3, spotId = $4, winnerId = $5 WHERE id = $6');
    expect(values).toEqual([needsApproval, firstComments, secondComments, spotId, winnerId, id]);
  });

  it('should print the correct results query', () => {
    const password = 'test-password', nameNumber = 'Koop.960';
    const attributes = {
      password
    };
    const { sql, values } = queryBuilder(User, attributes, {
      statement: 'UPDATE',
      id: nameNumber
    });

    expect(sql).toEqual('UPDATE TABLE users SET password = $1 WHERE nameNumber = $2');
    expect(values).toEqual([password, nameNumber]);
  });

  it('should print the correct results query', () => {
    const id = 1, performanceId = 100000000, userNameNumber = 'Koop.960', spotId = 'R12';
    const attributes = {
      id,
      performanceId,
      userNameNumber,
      spotId
    };
    const { sql, values } = queryBuilder(Challenge, attributes, {
      statement: 'UPDATE',
      id
    });

    expect(sql).toEqual('UPDATE TABLE challenges SET id = $1, performanceId = $2, userNameNumber = $3, spotId = $4 WHERE id = $5');
    expect(values).toEqual([id, performanceId, userNameNumber, spotId, id]);
  });

});

describe('INSERT', () => {
  it('should print the correct results query', () => {
    const needsApproval = true, firstComments = 'test', secondComments = 'blah', spotId = 'R10', winnerId = 'Koop.960', id = 1;
    const attributes = {
      id,
      needsApproval,
      firstComments,
      secondComments,
      spotId,
      winnerId
    };
    const { sql, values } = queryBuilder(Result, attributes);

    expect(sql).toEqual('INSERT INTO results (id, needsApproval, firstComments, secondComments, spotId, winnerId) VALUES($1, $2, $3, $4, $5, $6)');
    expect(values).toEqual([id, needsApproval, firstComments, secondComments, spotId, winnerId]);
  });

  it('should print the correct results query', () => {
    const password = 'test-password';
    const attributes = {
      password
    };
    const { sql, values } = queryBuilder(User, attributes);

    expect(sql).toEqual('INSERT INTO users (password) VALUES($1)');
    expect(values).toEqual([password]);
  });

  it('should print the correct results query', () => {
    const id = 1, performanceId = 100000000, userNameNumber = 'Koop.960', spotId = 'R12';
    const attributes = {
      id,
      performanceId,
      userNameNumber,
      spotId
    };
    const { sql, values } = queryBuilder(Challenge, attributes);

    expect(sql).toEqual('INSERT INTO challenges (id, performanceId, userNameNumber, spotId) VALUES($1, $2, $3, $4)');
    expect(values).toEqual([id, performanceId, userNameNumber, spotId]);
  });


});
