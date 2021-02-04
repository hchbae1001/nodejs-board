var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engines = require('consolidate');
const ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/boards');
var app = express();
var methodOverride = require('method-override');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');
var sequelize = require('./models').sequelize;
// sequelize.sync();
app.use(session({
  secret: 'bae',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: '192.168.0.3',
    port: 3306,
    user: 'usr_demo',
    password: 'Maria3570!',
    database: 'demo'
  })
}));

app.use('/js',express.static(__dirname +"/public/javascripts"));
app.use('/img',express.static(__dirname +"/public/images"));
app.use('/audio',express.static(__dirname +"/public/audio"));
app.use(methodOverride('_method'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
// app.engine('html',engines.mustache);
// app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
