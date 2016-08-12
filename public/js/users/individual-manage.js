const banner = require('../utils/banner');

const closeButtonClass = '.IndividualManage-button-close';
const mainClass = '.IndividualManage';
const openButtonClass = '.IndividualManage-button-open';
const openSpotReasonClass = '.IndividualManage-reason';
const performanceSelectClass = '.IndividualManage-performanceSelect';
const spotOptionClasses = ['IndividualManage-failed', 'IndividualManage-other', 'IndividualManage-volunteer'];

$(openButtonClass).on('click', () => {
  const performanceId = getPerformanceId();
  const [nameNumber, spotId] = getNameNumberSpotId();
  const apiUrl = '/users/manage';
  let reason, voluntary = false;

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
          reason = 'Voluntarily Opened Spot';
          voluntary = true;
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
      voluntary
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

$(closeButtonClass).on('click', () => {
  const performanceId = getPerformanceId();
  const [nameNumber, spotId] = getNameNumberSpotId();
  const apiUrl = '/users/manage/close';

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
      spotId
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

const getPerformanceId = () => parseInt($(performanceSelectClass).val(), 10);
const getNameNumberSpotId = () => $(mainClass).attr('class').split(' ').slice(2);
