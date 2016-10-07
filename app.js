const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const jwt = require('express-jwt');
const logger = require('morgan');
// const passport = require('./auth').passport;
const path = require('path');
// const Redis = require('redis');
// const session = require('express-session');
// const url = require('url');

// const RedisStore = require('connect-redis')(session);
const routes = require('./routes/routes');
// const setViewEngine = require('./views');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// setViewEngine(app);

//session setup

//  If there is a env variable for redis_url (like in staging/prod), create a redis client
// If there isn't, we're probably in local, so just use memory store so there's one less thing to worry about
// let redis;
//
// if (process.env.REDIS_URL) {
//   const rtg = url.parse(process.env.REDIS_URL);
//
//   redis = Redis.createClient({ port: rtg.port, host: rtg.hostname, password: process.env.REDIS_PASSWORD });
// } else {
//   redis = Redis.createClient();
// }

app.use(jwt({ secret: 'shhhhhhared-secret' }).unless({ path: [/\/.+\.(?:js|ico|png|jpeg)/, /\/(?:token)?/] }));// app.use(session({
//   secret: process.env.PASSPORT_SECRET || 'notMuchOfASecret',
//   resave: true,
//   saveUninitialized: true,
//   store: new RedisStore({ client: redis })
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/dist')));
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));

//routing
app.use('/', routes);

routes.setup(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('static-pages/error', {
      error: err,
      message: err.message,
      user: req.user
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('static-pages/error', {
    error: {},
    message: err.message,
    user: req.user
  });
});

exports.app = app;
