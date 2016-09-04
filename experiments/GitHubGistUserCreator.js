const bcrypt = require('bcrypt');
const GitHub = require('github-api');
const crypto = require('crypto');

const { User } = require('../models');
const { email } = require('../utils');

const GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_GIST_ID = process.env.GITHUB_GIST_ID;

// Authenticate using a GitHub Token
const ghClient = new GitHub({
  token: GITHUB_API_TOKEN
});

const userGist = ghClient.getGist(GITHUB_GIST_ID);

userGist.read((err, gist) => {
  if (err) {
    console.error(err);
    return;
  }

  JSON.parse(gist['files']['users.json']['content']).forEach((user) => { // eslint-disable-line dot-notation
    const current_date = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    const password = crypto.createHmac('sha1', current_date).update(random).digest('hex');

    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(1)); // eslint-disable-line no-sync
    return User.create(user.name, user.nameNumber, user.instrument, user.part, user.role, user.spotId, user.email, user.password)
      .then(() => {
        email.sendUserCreateEmail(user.email, user.nameNumber, password);
        return;
      })
      .catch(console.error);
  });
});
