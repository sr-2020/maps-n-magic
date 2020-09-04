const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const indexRouter = require('./routes/index');
const fileListRouter = require('./routes/fileList');
const characterStatesRouter = require('./routes/characterStates');
const fileRouter = require('./routes/file');
const usersRouter = require('./routes/users');


const app = express();

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
app.use(cors());

// app.use(cors({
//   origin: 'http://yourapp.com'
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/fileList', fileListRouter);
app.get('/file/:name', fileRouter);
app.all('/characterStates', characterStatesRouter);

app.use(express.static(path.join(__dirname, '../build')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next(createError(404));
  res.sendFile(path.join(__dirname, '../build', '/index.html'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
