const bodyParser = require('body-parser');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const logger = require('morgan');
const path = require('path');

const auth = require('./auth');
const { getToken, getUserFromToken, refreshToken, verifyToken } = auth;
const { routes } = require('./config');

const app = express();

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/dist')));
app.use('/static', express.static(path.join(__dirname, '/build/static')));


console.log(process.env.NODE_ENV);

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5100');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});
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
app.use('/api', routes(auth));

// After controllers attach response, combine with token and send
app.use('/api', (req, res) => res.json(Object.assign({}, { token: res.locals.token }, res.locals.jsonResp)));

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});

app.set('port', 3001);
const server = http.createServer(app);

server.listen(3001);
exports.app = app;
