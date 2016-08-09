const divClass = '.ResultsEvaluation';
const firstNNClass = '.ResultsEvaluation-firstNameNumber';
const secondNNClass = '.ResultsEvaluation-secondNameNumber';
const firstCommentsClass = '.ResultsEvaluation-firstComments';
const secondCommentsClass = '.ResultsEvaluation-secondComments';
const submitClass = '.ResultsEvaluation-submit';

$(submitClass).on('click', (a) => {
  const spotId = a.target.className.split(' ')[1];
  const resultId = a.target.className.split(' ')[2];
  const firstNN = $($(`${firstNNClass}.${resultId}`).children()[1])[0];
  const secondNN = $($(`${secondNNClass}.${resultId}`).children()[1])[0];
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
      winnerId: firstNN.checked ? firstNN.value : secondNN.value
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw new Error('Whoops');
    }
    $(`${divClass}.${resultId}`).remove();
    banner('Success!');
  })
  .catch(() => {
    banner('We\'re sorry! There was a problem with your request. We\'re working to resolve the issue');
  });
});

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};
