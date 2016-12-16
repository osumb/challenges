/* eslint-disable no-undef */
const queryBuilder = require('../utils').db.queryBuilder;
const Challenge = require('../api/models/challenge-model');
const Result = require('../api/models/result-model');
const User = require('../api/models/user-model');
const { snakeCase } = require('../utils/object-keys-case-change');

console.log('==> QUERY BUILDER');
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
    const { sql, values } = queryBuilder(Result, snakeCase(attributes), {
      statement: 'UPDATE',
      id: 1
    });

    expect(sql).toEqual('UPDATE results SET needs_approval = $1, first_comments = $2, second_comments = $3, spot_id = $4, winner_id = $5 WHERE id = $6');
    expect(values).toEqual([needsApproval, firstComments, secondComments, spotId, winnerId, id]);
  });

  it('should print the correct results query', () => {
    const password = 'test-password', nameNumber = 'Koop.960';
    const attributes = {
      password
    };
    const { sql, values } = queryBuilder(User, snakeCase(attributes), {
      statement: 'UPDATE',
      id: nameNumber
    });

    expect(sql).toEqual('UPDATE users SET password = $1 WHERE name_number = $2');
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
    const { sql, values } = queryBuilder(Challenge, snakeCase(attributes), {
      statement: 'UPDATE',
      id
    });

    expect(sql).toEqual('UPDATE challenges SET id = $1, performance_id = $2, user_name_number = $3, spot_id = $4 WHERE id = $5');
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
    const { sql, values } = queryBuilder(Result, snakeCase(attributes));

    expect(sql).toEqual('INSERT INTO results (id, needs_approval, first_comments, second_comments, spot_id, winner_id) VALUES($1, $2, $3, $4, $5, $6)');
    expect(values).toEqual([id, needsApproval, firstComments, secondComments, spotId, winnerId]);
  });

  it('should print the correct results query', () => {
    const password = 'test-password';
    const attributes = {
      password
    };
    const { sql, values } = queryBuilder(User, snakeCase(attributes));

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
    const { sql, values } = queryBuilder(Challenge, snakeCase(attributes));

    expect(sql).toEqual('INSERT INTO challenges (id, performance_id, user_name_number, spot_id) VALUES($1, $2, $3, $4)');
    expect(values).toEqual([id, performanceId, userNameNumber, spotId]);
  });


});
