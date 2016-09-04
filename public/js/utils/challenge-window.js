const moment = require('moment');

const closeAtElement = document.getElementsByClassName('ChallengeWindow-closeAt')[0];
const openAtElement = document.getElementsByClassName('ChallengeWindow-openAt')[0];

if (closeAtElement && openAtElement) {
  closeAtElement.innerHTML = moment(closeAtElement.innerHTML).format('MMM, Do h:mm A');
  openAtElement.innerHTML = moment(openAtElement.innerHTML).format('MMM, Do h:mm A');
} else if (closeAtElement) {
  closeAtElement.innerHTML = moment(closeAtElement.innerHTML).format('MMM, Do h:mm A');
}
