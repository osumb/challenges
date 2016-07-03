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

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};

const validInput = () => {
  const { performanceName, performanceDate, openAt, closeAt } = inputs;

  return performanceName.val().length > 0 &&
    !isNaN(Date.parse(performanceDate.val())) &&
    !isNaN(Date.parse(openAt.val())) &&
    !isNaN(Date.parse(closeAt.val()));
};
