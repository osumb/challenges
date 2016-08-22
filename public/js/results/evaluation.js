const banner = require('../utils/banner');

const divClass = '.ResultsEvaluation';
const firstNNButtonClass = '.ResultsEvaluation-firstNameNumber-button';
const secondNNButtonClass = '.ResultsEvaluation-secondNameNumber-button';
const firstCommentsClass = '.ResultsEvaluation-firstComments';
const secondCommentsClass = '.ResultsEvaluation-secondComments';
const submitClass = '.ResultsEvaluation-submit';

$(submitClass).on('click', (a) => {
  const spotId = a.target.className.split(' ')[1];
  const resultId = a.target.className.split(' ')[2];
  const firstNNButton = $(`${firstNNButtonClass}.${resultId}`)[0];
  const secondNNButton = $(`${secondNNButtonClass}.${resultId}`)[0];
  const firstComments = $(`${firstCommentsClass}.${resultId}`).val();
  const secondComments = $(`${secondCommentsClass}.${resultId}`).val();

  fetch('/performances/results/evaulate', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      id: Number.parseInt(resultId, 10),
      firstComments,
      secondComments,
      spotId,
      winnerId: firstNNButton.checked ? firstNNButton.value : secondNNButton.value
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw new Error('Whoops');
    }
    $(`${divClass}.${resultId}`).remove();
  })
  .catch(() => {
    banner('We\'re sorry! There was a problem with your request. We\'re working to resolve the issue');
  });
});
