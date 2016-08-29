const email = require('./email.js');

const adminActionLog = (message, obj = '') => {
  console.log(`ADMIN_ACTION_LOG: ${message}`, obj);
};

const challengesLog = (message, obj = '') => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`CHALLENGES_LOG: ${message}`, obj);
  }
};

const errorLog = (message, err = '') => {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'dev') {
    email.sendErrorEmail(message);
  }
  console.error(`ERROR_LOG: ${message}`, err);
};

const jobsLog = (message, obj = '') => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`JOBS_LOG: ${message}`, obj);
  }
};

module.exports = {
  adminActionLog,
  challengesLog,
  errorLog,
  jobsLog
};
