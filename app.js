'use strict';

const express = require('express');

const app = express();
const path = require('path');

const port = process.env.PORT || 8000;
// const favicon = require('serve-favicon');
const logger = require('./helpers/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

module.exports = app;

// Helmet is an npm module used to protect headers - you get lots out of the box like content security policy)
app.use(helmet());
const ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds, force: true }));
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.contentSecurityPolicy({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'http://www.google-analytics.com/', 'http://ajax.googleapis.com/', 'https://maps.googleapis.com/', 'https://unpkg.com/axios/dist/axios.min.js'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://maxcdn.bootstrapcdn.com/'],
    imgSrc: ["'self'", 'http://www.google-analytics.com/', 'https://csi.gstatic.com', 'https://maps.gstatic.com'],
    frameSrc: ["'none'"],
    fontSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com/'],
    objectSrc: ["'none'"]
  },
  reportOnly: false,
  setAllHeaders: true,
  disableAndroid: false,
  browserSniff: true
}));
app.use(helmet.noCache());
app.disable('view cache');

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/unauthorised.js')(app);
require('./routes/profile.js')(app);
require('./routes/calendar.js')(app);

app.get('*', function (req, res) {
  res.status(404);
  logger.error('404 error. Page ' + req.url + ' not found. ');
  res.render('errors/404');
});

// error handling
app.use(function (err, req, res, next) {
  res.status(500);
  logger.error(err);
  res.redirect('/profile');
  next();
});

app.listen(port);
console.log('All kicking off on port ' + port);
