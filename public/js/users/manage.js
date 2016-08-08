$('.UserSearch-search').on('keyup', ({ target }) => {
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
      appendUsersToSearch(users);
    })
    .catch(err => console.error(err));
  } else {
    $('.UserSearch-results').html('');
  }
});

const appendUsersToSearch = users => {
  const ul = document.createElement('ul'), cName = 'UserSearch-search-result list-group-item';

  ul.className = 'list-group';
  const list = $(ul);

  users.forEach(({ name, nameNumber }) => {
    list.append(
      $(`<li class="${cName}"><a href=/users/manage/${nameNumber}>Manage ${name}</a></li>`)
    );
  });

  $('.UserSearch-results').html(list);
};
