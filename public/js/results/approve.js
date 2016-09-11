const resultsListCheckboxClass = '.ResultsApprove-checkbox';
const resultListItemClass = '.ResultsApproveList-item';
const submitAllButton = '.ResultsApproveSubmitAll';
const submitCheckedButton = '.ResultsApproveSubmitChecked';
const url = '/results/approve';

$(submitAllButton).on('click', () => {
  const ids = getAllResultIds();

  sendApprovals(ids)
  .then(() => {
    removeIds(ids);
  })
  .catch((err) => console.error(err));
});

$(submitCheckedButton).on('click', () => {
  const ids = getAllCheckedIds();

  removeIds(ids);
  sendApprovals(ids)
  .then(() => {
    removeIds(ids);
  })
  .catch(err => console.error(err));
});

const sendApprovals = (ids) => {
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({ ids })
  });
};

const removeIds = (ids) => {
  ids.forEach((id) => {
    $(`${resultListItemClass}.${id}`).remove();
  });
  // window.location.reload(false);
};

const getIdFromElement = element => {
  if (element.target) {
    return $(element.target).attr('class').split(' ')[1];
  } else {
    return $(element).attr('class').split(' ')[1];
  }
};

const getAllResultIds = () => {
  const divs = $(`${resultListItemClass}`).toArray();

  return divs.map(getIdFromElement);
};

const getAllCheckedIds = () => {
  const divs = $(`${resultsListCheckboxClass}`).toArray();

  return divs.filter(div => div.checked).map(div => getIdFromElement(div));
};
