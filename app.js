'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('./auth').passport;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const routes = require('./routes/routes');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

//session setup
/*
  If there is a env variable for redis_url (like in staging/prod), create a redis client
  If there isn't, we're probably in local, so just use memory store so there's one less thing to worry about
*/
let redis;
if (process.env.REDIS_URL) {
  const rtg = require('url').parse(process.env.REDIS_URL);
  redis = require('redis').createClient({ port: rtg.port, host: rtg.hostname, password: process.env.REDIS_PASSWORD });
} else {
  redis = require('redis').createClient();
}

app.use(session( {
  secret: process.env.PASSPORT_SECRET || 'notMuchOfASecret',
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({ client: redis })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

//routing
app.use('/', routes);

routes.setup(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

exports.app = app;
