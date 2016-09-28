const cron = require('node-cron');
const emailChallengeList = require('./email-challenge-list.js');

// Every 5 minutes, from 8:00AM - 5:00 PM from Monday through Friday
const cronTime = '*/5 8-17 * * MON-FRI';

cron.schedule(cronTime, () => {
  emailChallengeList();
});
