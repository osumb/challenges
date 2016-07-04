$('.approveSubmitAll').on('click', () => {
  const ids = getAllResultIds();

  sendApprovals(ids)
  .then(() => {
    removeIds(ids);
    banner('There are no results to approve!');
  })
  .catch((err) => console.error(err));
});

$('.approveSubmitChecked').on('click', () => {
  const ids = getAllCheckedIds();

  sendApprovals(ids)
  .then(() => {
    removeIds(ids);
  });
});

const sendApprovals = (ids) => {
  return fetch('/results/approve', {
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
    $(`.resultsApprove-list-item ${id}`).remove();
  });
  window.location.reload(false);
};

const getIdFromElement = element => {
  if (element.target) {
    return $(element.target).attr('class').split(' ')[1];
  } else {
    return $(element).attr('class').split(' ')[1];
  }
};

const getAllResultIds = () => {
  const divs = $('.resultsApprove-list-item').toArray();

  return divs.map(getIdFromElement);
};

const getAllCheckedIds = () => {
  const divs = $('.resultsApprove-list-item').toArray();

  return divs.filter(div => $($(div).children()[0]).find('input')[0].checked).map(div => getIdFromElement(div));
};

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};
