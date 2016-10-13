const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

const { getToken, getUserFromToken, verifyToken } = require('./auth');
const router = require('./routes/routes');

const app = express();

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/dist')));
app.use((req, res, next) => {
  const token = getToken(req);

  verifyToken(token)
    .then((verified) => {
      if (verified) req.user = getUserFromToken(token);
      if (!verified) req.user = {};
      next();
    })
    .catch((err) => {
      console.error(err);
      req.user = {};
      next();
    });
});
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));

app.use('/api', router);

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

exports.app = app;
