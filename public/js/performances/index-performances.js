const { banner, timeFormat } = require('../utils');

timeFormat(['Performance-editOpenAt', 'Performance-editCloseAt'], 'MMM, Do h:mm A');

const exportButtonClass = 'Performance-editListExportedButton';

$(`.${exportButtonClass}`).on('click', ({ target }) => {
  const performanceId = target.className.split(' ')[1];

  fetch('/emailList', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      performanceId
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw response;
    }
    banner('Email Sent');
  })
  .catch((err) => {
    banner('Sorry! There was a problem with your request');
    console.error(err);
  });
});
