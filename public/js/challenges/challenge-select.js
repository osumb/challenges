const banner = require('../utils/banner');
const selectClass = '.ChallengeSelect';
const submitButtonClass = '.ChallengeSelect-submit';

$(submitButtonClass).on('click', () => {
  const optionVals = $(selectClass).val().split(' ');
  const spotId = optionVals[0], name = optionVals[1];

  $(submitButtonClass).prop('disabled', true);
  fetch('performances/challenge', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      spotId
    })
  })
  .then((response) => response.json())
  .then(({ code }) => {
    if (code > 0) {
      throw code;
    }
    return;
  })
  .then(() => {
    banner(`You are challenging ${name} for spot ${spotId}`);
  })
  .catch((errorCode) => {
    let errorMessage;

    /* eslint-disable indent */
    switch (errorCode) {
      case 1:
        errorMessage = 'Sorry! That person was just challenged. Pick another person';
        break;
      case 2:
        errorMessage = 'You\'ve already made a challenge';
        break;
      default:
        errorMessage = 'Sorry! There was an error on our end. We\'re working on the issue';
    }

    $(submitButtonClass).prop('disabled', false);
    banner(errorMessage);
  });
});
