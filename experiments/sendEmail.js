const email = require('../utils').email;

email.sendChallengeSuccessEmail({
  nameNumber: 'tareshawty.3', // TODO: actually email the real person
  performanceName: 'Bowling Green Game',
  spotId: 'A2'
})
.then(console.log);
