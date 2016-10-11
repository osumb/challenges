const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const jwtDecode = require('jwt-decode');
const logger = require('morgan');
const path = require('path');

const { getToken, verifyToken } = require('./auth');
const routes = require('./routes/routes');

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
      if (verified) req.user = jwtDecode(token);
      if (!verified) req.user = {};
      next();
    })
    .catch((err) => {
      console.error(err);
      next();
    });
});

app.use('/public/images', express.static(path.join(__dirname, '/public/images')));

//routing
app.use('/', routes);

routes.setup(app);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send();
});

exports.app = app;
