var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const  connectDb  = require('./config/db');;
const cors = require('cors');
const socketIo = require('socket.io');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/message');

var app = express();
const server = require('http').createServer(app);
const baseAPIUrl = `/api/${process.env.API_VER}`;

connectDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({
  origin: "https://messaging-socket-app-fe.vercel.app", // Ensure no trailing slash
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(`${baseAPIUrl}/users`, usersRouter);
app.use(`${baseAPIUrl}/`, messageRouter);


const io = socketIo(server, {
  cors: {
    origin: "https://messaging-socket-app-fe.vercel.app", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

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
