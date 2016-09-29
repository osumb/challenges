const cron = require('node-cron');
const emailChallengeList = require('./email-challenge-list.js');

// Every 5 minutes, from 8:00AM - 7:00 PM ETC everyday
// The time is in UTC though!
const cronTime = '*/5 12-23 * * *';

cron.schedule(cronTime, () => {
  emailChallengeList();
});
