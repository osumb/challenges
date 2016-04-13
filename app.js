'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const config = require('./config/config');
const http = require('http');

const routes = require('./routes/routes');
const StaticPagesController = require('./controllers/StaticPages');
const PerformanceController = require('./controllers/Performance');
const UsersController = require('./controllers/Users');
const ChallengersController = require('./controllers/Challengers');
const ResultsController = require('./controllers/Results');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

//routing
app.use('/', routes);
const controllers = {
  staticPages: new StaticPagesController(),
  performance: new PerformanceController(),
  users: new UsersController(),
  challenges: new ChallengersController(),
  results: new ResultsController()
};

routes.setup(app, controllers);

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

let server;
function start() {
  routes.setup(app, controllers);
  var port = config.server.port;
  server = http.createServer(app);
  server.listen(port);
  console.log('Express server listening on port %d in %s mode', port);
}

function end() {
  server.close();
}

exports.app = app;
exports.start = start;
exports.end = end;
