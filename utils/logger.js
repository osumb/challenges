const { email } = require('./index');

const challengesLog = (message) => {
  console.log(`CHALLENGES_LOG: ${message}`);
};

const errorLog = ({ level, message }) => {
  if (level > 3) {
    email.sendErrorEmail(message);
  }
  console.error(`ERROR_LOG: LEVEL: ${level}, msg: ${message}`);
};

const jobsLog = (message) => {
  console.log(`JOBS_LOG: ${message}`);
};

module.exports = {
  challengesLog,
  errorLog,
  jobsLog
};
