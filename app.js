const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

const { getToken, getUserFromToken, refreshToken, verifyToken } = require('./auth');
const router = require('./routes/routes');

const app = express();

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/dist')));
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));

// This middleware verifies a possible token coming in from a request
// If there is a valid token, add the corresponding user to req.user and refreshes expiration date on token
// It also appends token to res.locals.token
app.use((req, res, next) => {
  const token = getToken(req);

  verifyToken(token)
    .then((verified) => {
      if (verified) {
        req.user = getUserFromToken(token);
        res.locals.token = refreshToken(req.user);
      }
      if (!verified) req.user = null;
      next();
    })
    .catch((err) => {
      console.error(err);
      req.user = null;
      next();
    });
});

// Api middleware assumes appends response (if successful) to res.locals.jsonResp
// Failed responses won't make it past this middleware
app.use('/api', router);

// After controllers attach response, combine with token and send
app.use('/api', (req, res) => res.json(Object.assign({}, { token: res.locals.token }, res.locals.jsonResp)));

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

exports.app = app;
