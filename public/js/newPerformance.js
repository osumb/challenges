/* eslint-disable no-undef */
const inputs = {
  performanceName: $('.performanceName'),
  performanceDate: $('.performanceDate'),
  openAt: $('.openAt'),
  closeAt: $('.closeAt'),
  current: $('.current')
};

$('.newPerformanceSubmit').on('click', () => {
  if (validInput()) {
    fetch('/performances/create', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        performanceName: inputs.performanceName.val(),
        performanceDate: inputs.performanceDate.val(),
        openAt: inputs.openAt.val(),
        closeAt: inputs.closeAt.val(),
        current: inputs.current.is(':checked')
      })
    })
    .then(() => {
      clearInput();
    })
    .catch(err => console.error(err));

  } else {
    console.log('Bad data');
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
