const createError = require('http-errors');
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const shortid = require('shortid');

const cors = require('cors');
const { makeGameModel } = require('sr2020-mm-server-event-engine/configs/serverEventEngine');
const { winstonLogger } = require('sr2020-mm-event-engine/utils/winstonLogger');

const indexRouter = require('./routes/index');
const fileListRouter = require('./routes/fileList');
// const characterStatesRouter = require('./routes/characterStates');
const fileRouter = require('./routes/file');
const pingRouter = require('./routes/ping');
const usersRouter = require('./routes/users');
const postUserPosition = require('./routes/postUserPosition');
const { WebSocketWrapper } = require('./webSocketWrapper');

winstonLogger.info('process.env.NODE_ENV', process.env.NODE_ENV);

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const { gameModel, gameServer } = makeGameModel({});

const app = express();
const wsApp = expressWs(app);

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
app.use(cors());

// app.use(cors({
//   origin: 'http://yourapp.com'
// }));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(morganLogger('dev', { stream: winstonLogger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/fileList', fileListRouter);
app.get('/file/:name', fileRouter);
app.get('/ping', pingRouter);
app.post('/postUserPosition/:characterId', postUserPosition);
// app.all('/characterStates', characterStatesRouter);

app.ws('/ws', (ws, req, next) => {
  ws.on('message', (msgStr) => {
    // console.log('msg:', msgStr);
    const msg = JSON.parse(msgStr);
    if (msg.message && msg.message === 'initClientConfig') {
      const ip = req.connection.remoteAddress;
      const id = shortid.generate();
      const childLogger = winstonLogger.customChild(winstonLogger, { service: `ws_session_${id}` });
      childLogger.info(ip, 'initClientConfig', msgStr);
      new WebSocketWrapper(ws, gameModel, msg, childLogger);
    }
  });
});

app.use(express.static(path.join(__dirname, './static')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next(createError(404));
  res.sendFile(path.join(__dirname, './static', '/index.html'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: err });
});

module.exports = app;
