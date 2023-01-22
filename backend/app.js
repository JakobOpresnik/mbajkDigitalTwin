var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// connection to the database
var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1/projekt_db";
mongoose.connect(mongoDB);
// mongoose is using global promise library
mongoose.Promise = global.Promise;
// get default connection
var db = mongoose.connection;

// database error handling
db.on("error", console.error.bind(console, "MongoDB connection error!"));

var usersRouter = require('./routes/userRoutes');
var MBajkRouter = require('./routes/MBajkRoutes');
var standRouter = require('./routes/standRoutes');
var bikeShedRouter = require('./routes/bikeShedRoutes');
var bikePathRouter = require('./routes/bikePathRoutes');
var tourPathRouter = require('./routes/tourPathRoutes');
var coridorRouter = require('./routes/coridorRoutes');

var app = express();

// include CORS
var cors = require('cors');
var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  //exposedHeaders: "X-Total-Count",
  origin: function(origin, callback) {
    // allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adding session
/*var session = require("express-session");
var MongoStore = require("connect-mongo");
const exp = require('constants');
app.use(session({
  secret: "projekt_sp",
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB}) // storing session in database
}));

// saving session variables to locals
// so we can access them in all views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});*/

app.use('/users', usersRouter);
app.use('/mbajk', MBajkRouter);
app.use('/stand', standRouter);
app.use('/bikeshed', bikeShedRouter);
app.use('/bikepath', bikePathRouter);
app.use('/tourpath', tourPathRouter);
app.use('/coridor', coridorRouter);


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