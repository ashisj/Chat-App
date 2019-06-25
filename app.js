var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userApiRoute = require('./api/routes/userRoute');

require('./config.js')
var app = express();

//Database connection
mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true},(err) =>{
  if(err){
      console.log(err.message);
  } else {
      console.log("Conncected Successfully");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key : 'user_sid',
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUnintialized : false,
  store : new MongoStore({mongooseConnection : mongoose.connection }),
  cookie: {maxAge:180*60*1000}
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

app.use('/api/user', userApiRoute);
app.use('/', indexRouter);

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
