const { email } = require('./index');

const challengesLog = (message) => {
  console.log(`CHALLENGES_LOG: ${message}`);
};

const errorLog = (message) => {
  if (process.env.NODE_ENV !== 'dev') {
    email.sendErrorEmail(message);
  }
  console.error(`ERROR_LOG: ${message}`);
};

const jobsLog = (message) => {
  console.log(`JOBS_LOG: ${message}`);
};

module.exports = {
  challengesLog,
  errorLog,
  jobsLog
};
