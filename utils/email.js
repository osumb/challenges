/* eslint-disable new-cap, no-sync */
const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment');
const path = require('path');
const sendGrid = require('sendgrid');

const helper = sendGrid.mail;
const sg = sendGrid.SendGrid(process.env.SENDGRID_API_KEY);
const fromMail = new helper.Email('osumbit@gmail.com');

const challengeListSource = fs.readFileSync(path.resolve(__dirname, '../views/emails/challenge-list.handlebars'), 'utf8');
const userCreateSource = fs.readFileSync(path.resolve(__dirname, '../views/emails/user-create.handlebars'), 'utf8');

const challengeListTemplate = Handlebars.compile(challengeListSource);
const userCreateTemplate = Handlebars.compile(userCreateSource);

const sendChallengeList = (recipients, fileData) => {
  const request = sg.emptyRequest();

  request.body = {
    attachments: [
      {
        content: fileData,
        content_id: 'ii_139db99fdb5c3704',
        disposition: 'inline',
        filename: `challenge-list-${moment().format('YYYY-MM-DD')}.csv`,
        type: 'csv'
      }
    ],
    content: [
      {
        type: 'text/html',
        value: challengeListTemplate()
      }
    ],
    from: {
      email: 'osumbit@gmail.com',
      name: 'Challenge App'
    },
    mail_settings: {
      subject: `Challenge List For ${moment().format('YYYY-MM-DD')}`
    },
    personalizations: [
      {
        to: recipients,
        subject: 'Challenge List'
      }
    ],
    subject: 'Challenge List'
  };

  request.method = 'POST';
  request.path = '/v3/mail/send';

  return new Promise(resolve => {
    sg.API(request, resolve);
  });
};

const sendPasswordRecoveryEmail = (email, id) => {
  let url = 'http://localhost:3000/resetPassword';

  if (process.env.NODE_ENV === 'production') {
    url = 'https://osumbchallenges.herokuapp.com/resetPassword';
  } else if (process.env.NODE_ENV === 'staging') {
    url = 'https://osumbchallengesdev.herokuapp.com/resetPassword';
  }

  url = `${url}?id=${id}`;

  const to = new helper.Email(email);
  const subject = 'Challenge App Email Recovery';
  const source = fs.readFileSync(path.resolve(__dirname, '../views/emails/password-recovery.handlebars'), 'utf8');
  const template = Handlebars.compile(source);

  const content = new helper.Content('text/html', template({ url }));
  const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

  const request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;

  return new Promise((resolve) => {
    sg.API(request, resolve);
  });
};

const sendChallengeSuccessEmail = (options) => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    const { email, spotId, performanceName } = options;
    const to = new helper.Email(email);
    const subject = `Challenges for ${performanceName}`;
    const source = fs.readFileSync(path.resolve(__dirname, '../views/emails/challenge-signup-confirmation.handlebars'), 'utf8');
    const template = Handlebars.compile(source);

    const content = new helper.Content('text/html', template({ performanceName, spotId }));
    const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

    const request = sg.emptyRequest();

    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    return new Promise((resolve) => {
      sg.API(request, resolve);
    });
  }
  return new Promise((resolve) => resolve());
};

const sendErrorEmail = (errMessage) => {
  const to = new helper.Email('atareshawty@gmail.com');
  const subject = 'Error From Challenge App';
  const content = new helper.Content('text/plain', `${errMessage}`);
  const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

  const request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, (response) => {
    console.log('ERROR_EMAIL:', response);
  });
};

const sendUserCreateEmail = (email, nameNumber, password) => {
  const to = new helper.Email(email);
  const subject = 'OSUMB Challenge Manager Account';
  const content = new helper.Content('text/html', userCreateTemplate({ nameNumber, password }));
  const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

  const request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, (data) => {
    console.log('EMAIL: user create', data);
  });
};

module.exports = {
  sendChallengeList,
  sendChallengeSuccessEmail,
  sendErrorEmail,
  sendPasswordRecoveryEmail,
  sendUserCreateEmail
};
