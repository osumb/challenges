$('.approveSubmit').on('click', (element) => {
  const id = $(element.target).attr('class').split(' ')[1];

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
