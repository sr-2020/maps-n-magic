// const createError = require('http-errors');
import Express from 'express';
import ExpressWs from 'express-ws';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morganLogger from 'morgan';
import shortid from 'shortid';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import EventSource from "eventsource";

import { winstonLogger } from 'sr2020-mm-server-event-engine';
import { makeGameModel } from "./gameModel";
// import { WebSocketInitClientConfig } from 'sr2020-mm-event-engine';

import { indexRouter } from './routes/index';
import { fileListRouter } from './routes/fileList';
import { fileRouter } from './routes/file';
import { pingRouter } from './routes/ping'; 
import { loginRouter } from './routes/login'; 
import { parseUserData } from './routes/parseUserData'; 
import { usersRouter } from './routes/users';
import { postUserPosition } from './routes/postUserPosition';
import { WebSocketWrapper } from './webSocketWrapper';
import { ELocationRecordsChanged2, ESetSpirits, ESpiritsChanged, EUserRecordsChanged, SetLocationRecords, SetUserRecords } from 'sr2020-mm-event-engine';
import { MM_MASTER_SERVER_URL } from "./constants";
import { SsePlayerDataSender } from './ssePlayerDataSender';
import { spiritRouter } from "./routes/spirits";
import { logoutRouter } from "./routes/logout";
import { AuthorizedRequest } from './types';

// const express = require('express');
// const expressWs = require('express-ws');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const morganLogger = require('morgan');
// const shortid = require('shortid');

// const cors = require('cors');

// const indexRouter = require('./routes/index.ts');
// const fileListRouter = require('./routes/fileList.ts');
// // const characterStatesRouter = require('./routes/characterStates');
// const fileRouter = require('./routes/file.ts');
// const pingRouter = require('./routes/ping.ts');
// const usersRouter = require('./routes/users.ts');
// const postUserPosition = require('./routes/postUserPosition.ts');
// const { WebSocketWrapper } = require('./webSocketWrapper.ts');

// const express = require('express');
// const expressWs = require('express-ws');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const morganLogger = require('morgan');
// const shortid = require('shortid');

// const cors = require('cors');

// const indexRouter = require('./routes/index.ts');
// const fileListRouter = require('./routes/fileList.ts');
// // const characterStatesRouter = require('./routes/characterStates');
// const fileRouter = require('./routes/file.ts');
// const pingRouter = require('./routes/ping.ts');
// const usersRouter = require('./routes/users.ts');
// const postUserPosition = require('./routes/postUserPosition.ts');
// const { WebSocketWrapper } = require('./webSocketWrapper.ts');

winstonLogger.info('process.env.NODE_ENV', process.env.NODE_ENV);

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const { gameModel, gameServer } = makeGameModel();

export const app: core.Express = Express();
const wsApp = ExpressWs(app);

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

const allowedOrigins = [
  // webpack local server
  'http://localhost:3000', 
  'http://localhost:3002',
  'http://localhost:3002/',
];

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin. ' +
                `allowed ${JSON.stringify(allowedOrigins)}, origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// app.use(cors());
// app.use(cors({
//   credentials: true
// }));

// app.use(cors({
//   origin: 'http://yourapp.com'
// }));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// @ts-ignore
app.use(morganLogger('dev', { stream: winstonLogger.stream }));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// app.get('/fileList', fileListRouter);
// app.get('/file/:name', fileRouter);
app.get('/ping', pingRouter);
// app.use('/api/*', loginRouter);
app.use(loginRouter);

app.use(parseUserData);

app.use(spiritRouter);

app.use(logoutRouter);

app.get('/singlePlayerDataSse', (req, res, next) => {
  winstonLogger.info('Processing playerDataSse connection');
  const { userData } = req as AuthorizedRequest;
  new SsePlayerDataSender(req, res, next, winstonLogger, gameModel, userData);
});


// app.use('/api/login', loginRouter);
// app.post('/postUserPosition/:characterId', postUserPosition);
// app.all('/characterStates', characterStatesRouter);

// wsApp.app.ws('/ws', (ws, req, next) => {
//   ws.on('message', (msgStr) => {
//     // console.log('msg:', msgStr);
//     const msg = JSON.parse(msgStr.toString()) as {message?: string};
//     if (msg.message && msg.message === 'initClientConfig') {
//       const ip = req.connection.remoteAddress;
//       const id = shortid.generate();
//       const childLogger = winstonLogger.customChild ? 
//         winstonLogger.customChild(winstonLogger, { service: `ws_session_${id}` }) :
//         winstonLogger;
//       childLogger.info(ip, 'initClientConfig', msgStr);
//       new WebSocketWrapper(ws, gameModel, msg as WebSocketInitClientConfig, childLogger);
//     }
//   });
// });

app.use(Express.static(path.join(__dirname, './static')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next(createError(404));
  res.sendFile(path.join(__dirname, './static', '/index.html'));
});

// error handler
// @ts-ignore
app.use((err, req: Request, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // @ts-ignore
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winstonLogger.info('error on request', req.headers, err.toString());

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: err });
});

// export const app = app;

// module.exports = app;

const isSpiritsChanged = (obj: any): obj is ESpiritsChanged => {
  return obj.type === 'spiritsChanged';
}
const isLocationRecordsChanged = (obj: any): obj is ELocationRecordsChanged2 => {
  return obj.type === 'locationRecordsChanged2';
}
const isUserRecordsChanged = (obj: any): obj is EUserRecordsChanged => {
  return obj.type === 'userRecordsChanged';
}

const es = new EventSource(MM_MASTER_SERVER_URL + '/playerDataSse');
es.addEventListener('message', function (e) {
  try {
    const { data }: { data: string } = e;
    const parsedData: unknown = JSON.parse(data);
    if (isSpiritsChanged(parsedData)) {
      winstonLogger.info(parsedData.type);
      gameModel.emit2<ESetSpirits>({
        ...parsedData,
        type: 'setSpirits',
      });
    } else if(isLocationRecordsChanged(parsedData)) {
      winstonLogger.info(parsedData.type);
      gameModel.execute2<SetLocationRecords>({
        ...parsedData,
        type: 'setLocationRecords',
      });
    } else if(isUserRecordsChanged(parsedData)) {
      winstonLogger.info(parsedData.type);
      gameModel.execute2<SetUserRecords>({
        ...parsedData,
        type: 'setUserRecords',
      });
    } else {
      winstonLogger.warn(`Unexpected sse message data ${JSON.stringify(e)}`);
    }
  } catch (err) {
    // console.error(err);
    winstonLogger.error('error', err);
    winstonLogger.error(`Error on processing sse message: ${JSON.stringify(err)}, message ${JSON.stringify(e)}`)
  }
})