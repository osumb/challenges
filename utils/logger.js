const email = require('./email.js');

const actionLog = (message, obj = '') => {
  console.log(`ACTION_LOG: ${message}`, obj);
};

const adminActionLog = (message, obj = '') => {
  console.log(`ADMIN_ACTION_LOG: ${message}`, obj);
};

const challengesLog = (message, obj = '') => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`CHALLENGES_LOG: ${message}`, obj);
  }
};

const errorLog = (message, err = '') => {
  if (process.env.NODE_ENV === 'production') {
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
  actionLog,
  adminActionLog,
  challengesLog,
  errorLog,
  jobsLog
};
