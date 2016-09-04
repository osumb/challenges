const bcrypt = require('bcrypt');
const github = require('github-api');

const { User } = require('../models');
const { email } = require('../utils');

const GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_GIST_ID = process.env.GITHUB_GIST_ID;

// Authenticate using a GitHub Token
const ghClient = new github({
  token: GITHUB_API_TOKEN
});

const gist = ghClient.getGist(GITHUB_GIST_ID);

gist.read(function (err, gist, xhr) {
  Promise.all(JSON.parse(gist['files']['users.json']['content']).map((user) => {
    user.password = bcrypt.hashSync(e[6], bcrypt.genSaltSync(1)); // eslint-disable-line no-sync
    return User.create(user.name, user.nameNumber, user.instrument, user.part, user.role, user.spotId, user.email, user.password)
      .then(() => { email.sendUserCreateEmail(user.email, user.nameNumber, user.password); });
  }))
  .then(console.log('success!')
  .catch(console.error);
});
