const mainClass = '.IndividualManage';
const buttonClass = '.IndividualManage-button-open';
const performanceSelectClass = '.IndividualManage-performanceSelect';
const spotOptionClasses = ['IndividualManage-failed', 'IndividualManage-other', 'IndividualManage-volunteer'];
const openSpotReasonClass = '.IndividualManage-reason';

$(buttonClass).on('click', () => {
  const select = $(performanceSelectClass);
  const performanceId = parseInt(select.val(), 10);
  const [nameNumber, spotId] = $(mainClass).attr('class').split(' ').slice(2);
  const apiUrl = '/users/manage';
  let reason;

  for (const option of spotOptionClasses) {
    if (document.getElementsByClassName(option)[0].checked) {

      /* eslint-disable indent */
      switch (option) {
        case 'IndividualManage-failed':
          reason = 'Failed Music Check';
          break;
        case 'IndividualManage-other':
          reason = $(openSpotReasonClass).val();
          break;
        default:
          break;
      }
      break;
    }
  }

  fetch(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      nameNumber,
      performanceId,
      reason,
      spotId,
      voluntary: !reason
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw new Error('Whoops');
    }
    window.location.reload(false);
  })
  .catch(() => {
    banner('We\'re sorry! There was a problem with your request. We\'re working to resolve the issue');
  });
});

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};
