const banner = require('../utils/banner');
const inputs = {
  performanceName: $('.PerformanceName'),
  performanceDate: $('.PerformanceDate'),
  openAt: $('.openAt'),
  closeAt: $('.closeAt')
};

$('.NewPerformanceSubmit').on('click', () => {
  if (validInput()) {
    fetch('/performances/create', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        closeAt: new Date(inputs.closeAt.val()).toISOString(),
        performanceName: inputs.performanceName.val(),
        performanceDate: inputs.performanceDate.val(),
        openAt: new Date(inputs.openAt.val()).toISOString()
      })
    })
    .then(() => {
      banner(`Successfully Created ${inputs.performanceName.val()}!`);
      clearInput();
    })
    .catch(err => {
      banner('We\'re sorry! There was an error creating your performance');
      console.error(err);
    });

  } else {
    banner('We couldn\'t create your new performance. Please format your input like the suggestions');
  }
});

const clearInput = () => {
  inputs.performanceName.val('');
  inputs.performanceDate.val('');
  inputs.openAt.val('');
  inputs.closeAt.val('');
};

const validInput = () => {
  const { performanceName, performanceDate, openAt, closeAt } = inputs;

  return performanceName.val().length > 0 &&
    !isNaN(Date.parse(performanceDate.val())) &&
    !isNaN(Date.parse(openAt.val())) &&
    !isNaN(Date.parse(closeAt.val()));
};
