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

$('.UserSearch-search-result-button').on('click', element => {
  console.log(element);
});

const appendUsersToSearch = users => {
  const ul = document.createElement('ul'), cName = 'UserSearch-search-result list-group-item';

  ul.className = 'list-group';
  const list = $(ul);

  users.forEach(({ name, nameNumber, eligible, spotId, spotOpen }) => {
    const spot = `Spot (${spotId}) ${spotOpen ? 'open' : 'not open'}`;
    const canChallenge = eligible ? 'Can challenge' : 'Can\'t challenge';
    const ineligibleButton = eligible ?
      `<button class="UserSearch-search-result-ineligibleButton ${nameNumber}">Make Ineligible</button>` :
      '';
    const openSpotButton = !spotOpen && parseInt(spotId.substring(1), 10) < 13 ?
      `<button class="UserSearch-search-result-openSpotbutton ${nameNumber}">Open Spot</button>` :
      '';

    list.append(
      $(`<li class="${cName}">${name} | ${canChallenge} | ${spot} ${ineligibleButton} ${openSpotButton}</li>`)
    );
  });

  $('.UserSearch-results').html(list);
};
