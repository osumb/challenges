$('.approveSubmit').on('click', (element) => {
  const id = getIdFromElement(element);

  sendApprovals([id])
  .then((response) => {
    if (response.status !== 200) {
      console.error('Bad response');
    } else {
      removeIds([id]);
    }
  })
  .catch((err) => console.error(err));
});

$('.approveSubmitAll').on('click', () => {
  const ids = getAllResultIds();

  sendApprovals(ids)
  .then(() => {
    removeIds(ids);
    removeAllButton();
    banner('There are no results to approve!');
  })
  .catch((err) => console.error(err));
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
    $(`.resultToApprove-${id}`).remove();
  });
};

const getIdFromElement = element => {
  if (element.target) {
    return $(element.target).attr('class').split(' ')[1];
  } else {
    return $(element).attr('class').split(' ')[1];
  }
};

const getAllResultIds = () => {
  const idButtons = $('.approveSubmit'), ids = [];

  for (let i = 0; i < idButtons.length; i++) {
    ids.push(getIdFromElement(idButtons[i]));
  }
  return ids;
};

const removeAllButton = () => {
  $('.approveSubmitAll').remove();
};

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};
