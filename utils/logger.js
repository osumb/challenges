const fs = require('fs');
const path = require('path');

const { email } = require('./index');
const timestamp = () => `${new Date().toISOString()} (UTC)`;

const challengesLog = (message) => {
  fs.appendFile(path.resolve(__dirname, '../logs/challenges.log'), `\n[${timestamp()}]: ${message}`, (err) => {
    if (err) {
      console.error('CHALLENGES_LOG_ERROR:', err);
    }
  });
};

const errorLog = ({ level, message }) => {
  if (level > 3) {
    email.sendErrorEmail(message);
  }
  fs.appendFile(
    path.resolve(__dirname, '../logs/errors.log'),
    `\n[${timestamp()}]: Level ${level} error: ${message}`,
    (err) => {
      if (err) {
        console.error('CHALLENGES_LOG_ERROR:', err);
      }
    });
};

const jobsLog = (message) => {
  fs.appendFile(path.resolve(__dirname, '../logs/jobs.log'), `\n[${timestamp()}]: ${message}`, (err) => {
    if (err) {
      console.error('CHALLENGES_LOG_ERROR:', err);
    }
  });
};

module.exports = {
  challengesLog,
  errorLog,
  jobsLog
};
