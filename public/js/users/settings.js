const { banner } = require('../utils');
const changePasswordButtonClass = '.ChangePassword-submit';
const changePasswordOldClass = '.ChangePassword-old';
const changePasswordNewClass = '.ChangePassword-new';
const changePasswordReTypeClass = '.ChangePassword-retype';

$(changePasswordButtonClass).on('click', () => {
  const oldPassword = $(changePasswordOldClass)[0].value;
  const newPassword = $(changePasswordNewClass)[0].value;
  const reTypePassword = $(changePasswordReTypeClass)[0].value;

  if (validInput(newPassword, reTypePassword)) {
    fetch('/users/password', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'put',
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    })
    .then((response) => {
      if (response.status >= 300) {
        throw status;
      }
      return response.json();
    })
    .then(({ success, error }) => {
      if (success) {
        if (window.location.pathname.split('/')[2] !== 'settings') {
          window.location.reload(true);
        }
        banner('Your password has successfully changed!');
      } else if (error) {
        throw error;
      } else {
        banner('Your old password was incorrect. Please try again');
      }
    })
    .catch((err) => {
      console.error(err);
      banner('Sorry, there was an error on our end. We\'re aware of and working on the issue');
    });
  } else {
    banner('New passwords don\'t match');
  }
});

const validInput = (newPassword, reTypePassword) => newPassword.length > 0 && newPassword === reTypePassword;
