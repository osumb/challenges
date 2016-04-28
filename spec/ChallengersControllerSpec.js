'use strict';
const ChallengersController = require('../controllers/Users');
const mockData = require('../models/mock-data');
const challengers = new ChallengersController();
//these are coming in sorted order of row (A1, A2, ..., X14)
const usersArray = mockData.getUsersFromExcelFile();
const separatedUsersArray = mockData.separateEligibleMembers(usersArray);
const eligibleChallengers = separatedUsersArray.eligibleChallengers;
const ineligibleChallengers = separatedUsersArray.ineligibleChallengers;

describe('ChallengersController.', () => {
  describe('new: ', () => {

  });
});
