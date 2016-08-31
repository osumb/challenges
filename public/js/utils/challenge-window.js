const moment = require('moment');

const openAtElement = document.getElementsByClassName('ChallengeWindow-openAt')[0];
const closeAtElement = document.getElementsByClassName('ChallengeWindow-closeAt')[0];

if (openAtElement && closeAtElement) {
  openAtElement.innerHTML = moment(openAtElement.innerHTML).format('MMM, Do h:mm A');
  closeAtElement.innerHTML = moment(closeAtElement.innerHTML).format('MMM, Do h:mm A');
}
