$('.UserSearch-search').on('keyup', ({ target }) => {
  console.log(target.value);
  if (target.value.length > 2) {
    fetch(`/users/search?q=${target.value}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'get'
    })
    .then(results => results.json())
    .then(users => {
      console.log(users);
      appendUsersToSearch(users);
    })
    .catch(err => console.error(err));
  } else {
    $('.UserSearch-results').html('');
  }
});

const appendUsersToSearch = users => {
  const list = $(document.createElement('ul')), cName = 'UserSearch-search-result';

  users.forEach(({ name, id, eligible, spotId }) => {
    list.append(
      $(`<li class="${cName} ${id}">${name} ${spotId} eligible: ${eligible}</li>`)
    );
  });

  $('.UserSearch-results').html(list);
};
