const sendGrid = require('sendgrid');
const helper = sendGrid.mail;
const sg = sendGrid.SendGrid(process.env.SENDGRID_API_KEY); // eslint-disable-line new-cap
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
    sg.API(request, (response) => { // eslint-disable-line new-cap
      resolve(response);
    });
  });
};


module.exports = {
  sendChallengeSuccessEmail
};
