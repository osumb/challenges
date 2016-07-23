/* eslint-disable new-cap */
const sendGrid = require('sendgrid');
const helper = sendGrid.mail;
const sg = sendGrid.SendGrid(process.env.SENDGRID_API_KEY);
const fromMail = new helper.Email('osumbit@gmail.com');

const sendChallengeSuccessEmail = (options) => {
  const { nameNumber, spotId, performanceName } = options;
  const to = new helper.Email(`${nameNumber}@osu.edu`);
  const subject = `Challenges for ${performanceName}`;
  const content = new helper.Content('text/plain', `You're challenging the ${spotId} spot for the ${performanceName}`);
  const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

  const request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  return new Promise((resolve) => {
    sg.API(request, (response) => {
      resolve(response);
    });
  });
};

const sendChallengeList = (recipient, fileData) => {
  const request = sg.emptyRequest();

  request.body = {
    attachments: [
      {
        content: fileData,
        content_id: 'ii_139db99fdb5c3704',
        disposition: 'inline',
        filename: 'challenge-list.xlsx',
        type: 'csv'
      }
    ],
    content: [
      {
        type: 'text/html',
        value: '<html><p>Here is the Challenge List This Week!</p></html>'
      }
    ],
    from: {
      email: 'osumbit@gmail.com',
      name: 'Challenge App'
    },
    mail_settings: {
      bcc: {
        email: 'tareshawty.3@osu.edu',
        enable: true
      },
      footer: {
        enable: true,
        html: '<p>Sincerely, The Challenge App Team</p>'
      },
      subject: 'Challenge List'
    },
    personalizations: [
      {
        to: [
          {
            email: recipient,
            name: 'OSUMB Office'
          }
        ],
        subject: 'Challenge List'
      }
    ],
    subject: 'Challenge List'
  };

  request.method = 'POST';
  request.path = '/v3/mail/send';

  return new Promise(resolve => {
    sg.API(request, response => {
      resolve(response);
    });
  });
};

module.exports = {
  sendChallengeList,
  sendChallengeSuccessEmail
};
