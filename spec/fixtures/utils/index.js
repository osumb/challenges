const path = require('path');
const xlsx = require('node-xlsx');
const bcrypt = require('bcrypt');

const parseChallengeListFromExcelFile = (type) => {
  const filePath = path.resolve(__dirname, `../${type}/challenges.xlsx`);
  const parsedXlsx = xlsx.parse(filePath);

  return parsedXlsx[0].data.slice(1).map((e) => ({
    userNameNumber: e[1],
    PerformanceId: 1,
    spotId: e[2]
  }));
};

const parseFinalSpotsFromTest = () => {
  const fileLocation = path.resolve(__dirname, '../test-data/test-final-spots.xlsx');
  const parsedXlsx = xlsx.parse(fileLocation);
  const spotsList = [];

  return parsedXlsx[0].data.slice(1).map(([nameNumber, spotId]) => ({
    nameNumber,
    spotId
  }));
};

const parseResultsFromExcelFile = (type) => {
  const filePath = path.resolve(__dirname, `../${type}/results.xlsx`);
  const parsedXlsx = xlsx.parse(filePath);

  return parsedXlsx[0].data.slice(1).map((e) => ({
    firstNameNumber: e[0],
    secondNameNumber: e[1],
    spotId: e[3],
    winnerId: e[4],
    comments1: e[5],
    comments2: e[6],
    pending: false
  }));
};

const parseSpotsFromExcelFile = (type) => {
  const filePath = path.resolve(__dirname, `../${type}/spots.xlsx`);
  const parsedXlsx = xlsx.parse(filePath);

  return parsedXlsx[0].data.slice(1).map((e) => ({
    id: e[0],
    open: e[1],
    challengedAmount: e[2]
  }));
};

const parseUsersFromExcelFile = (type) => {
  const filePath = path.resolve(__dirname, `../${type}/users.xlsx`);
  const parsedXlsx = xlsx.parse(filePath);

  return parsedXlsx[0].data.slice(1).map((e) => ({
    spotId: e[0],
    name: e[1],
    instrument: e[2],
    part: e[3],
    nameNumber: e[4],
    role: e[5],
    password: bcrypt.hashSync(e[6], bcrypt.genSaltSync(1)),
    email: e[7]
  }));
};

module.exports = {
  parseChallengeListFromExcelFile,
  parseFinalSpotsFromTest,
  parseResultsFromExcelFile,
  parseSpotsFromExcelFile,
  parseUsersFromExcelFile
}
