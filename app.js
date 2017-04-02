var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var membership = require('./routes/membership');
var precinct = require('./routes/precinct');
var meetings = require('./routes/meetings');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var fileUpload = require('express-fileupload');

var configDB = require('./config/database.js');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// session and passport info
app.use(session({
  secret: '5thDemsNeedToWin2039751-677',
  resave: true,
  saveUninitialized: true,
 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use('/', index);
app.use('/membership*', isLoggedIn);
app.use('/membership', membership);
app.use('/membership/precinct', precinct);
app.use('/membership/meetings', meetings);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    res.locals.username = req.user.email;
    res.locals.name = req.user.firstName + " " + req.user.lastName
    return next();
  } 
  res.redirect('/');
}
