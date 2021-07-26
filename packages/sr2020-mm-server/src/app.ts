// const createError = require('http-errors');
import Express from 'express';
import ExpressWs from 'express-ws';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morganLogger from 'morgan';
import shortid from 'shortid';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import * as jwt from "jsonwebtoken";

import { 
  mainServerConstants, 
  makeGameModel, 
  winstonLogger,
  createLogger,
  InnerApiRequest,
  MainAuthorizedRequest
} from 'sr2020-mm-server-event-engine';
import { ErrorResponse, validateWebSocketInitClientConfig, WebSocketInitClientConfig } from 'sr2020-mm-event-engine';

// import { indexRouter } from './routes/index';
// import { fileListRouter } from './routes/fileList';
// import { fileRouter } from './routes/file';
import { pingRouter } from './routes/ping';
// import { usersRouter } from './routes/users';
// import { postUserPosition } from './routes/postUserPosition';
import { WebSocketWrapper } from './webSocketWrapper';
import { SseDataSender } from "./sseDataSender";
import { publicApi } from './routes/publicApi';
// import { logoutRouter } from './routes/logout';
// import { parseUserData } from './routes/parseUserData';
import { spiritRouter } from './routes/spirits';
import { innerApi2 } from './routes/innerApi2';
import { getInnerApiGatekeeper, apiGatekeeper } from "./routes/gatekeepers";
import { miscRouter } from "./routes/miscApi";
import { mainLoadHistory } from './routes/loadHistory';
import { mainSpiritConsistencyReport } from './routes/spiritConsistencyReport';
import { mainMoveSpiritsToAstral } from './routes/moveSpiritsToAstral';
import { mainCheckQrById } from './routes/checkQrById';
import { mainCheckBodyStorageBatch, mainCheckSpiritJarsBatch } from './routes/checkQrsBatch';
import { mainForceFreeSpirit } from './routes/forceFreeSpirit';

const logger = createLogger('mainServer/app.ts');

logger.info('process.env.NODE_ENV', process.env.NODE_ENV);

const { gameModel, gameServer } = makeGameModel();

export const app: core.Express = Express();
const wsApp = ExpressWs(app);

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
app.use(cors());

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
app.get('/ping', pingRouter);

// player server - main server API

app.use('/innerApi', getInnerApiGatekeeper(gameModel));

app.use('/innerApi', spiritRouter);

app.get('/innerApi/playerDataSse', (req1, res, next) => {
  const req = req1 as InnerApiRequest;
  logger.info('playerDataSse connection OK');
  new SseDataSender(req, res, next, logger);
});

app.get('/innerApi/loadHistory/:characterId', mainLoadHistory);

// external server - main server API
//   At this moment only for shop

app.use('/innerApi2', innerApi2);


// client-server API

app.use('/api', publicApi);

app.use('/api', apiGatekeeper);

app.use('/api', (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;
  req.gameModel = gameModel;
  next();
});

app.use('/api', miscRouter);

app.get('/api/spiritConsistencyReport', mainSpiritConsistencyReport);

app.post('/api/moveSpiritsToAstral', mainMoveSpiritsToAstral);

app.get('/api/checkQrById/:qrId', mainCheckQrById);

app.get('/api/checkSpiritJarsBatch', mainCheckSpiritJarsBatch);

app.get('/api/checkBodyStorageBatch', mainCheckBodyStorageBatch);

app.post('/api/forceFreeSpirit', mainForceFreeSpirit);

wsApp.app.ws('/api/ws', (ws, req, next) => {
  ws.on('message', (msgStr) => {
    // logger.info('msg:', msgStr);
    try {
      const msg: unknown = JSON.parse(msgStr.toString());
      if((msg as any).message !== 'initClientConfig') {
        return;
      }
      if (validateWebSocketInitClientConfig(msg)) {
        const ip = req.connection.remoteAddress;
        const id = shortid.generate();
        const childLogger = winstonLogger.customChild ? 
          winstonLogger.customChild(winstonLogger, { service: `ws_session_${id}` }) :
          winstonLogger;
        childLogger.info(ip, 'initClientConfig', msgStr);
        new WebSocketWrapper(ws, gameModel, msg as WebSocketInitClientConfig, childLogger);
      } else {
        logger.error(`Error on validation websocket init msg. Msg ${JSON.stringify(msg)}, errors ${JSON.stringify(validateWebSocketInitClientConfig.errors)} `);
      }
    } catch(err) {
      logger.error('Error on establishing websocket connection', err);
    }
  });
});

wsApp.app.ws('/ws', (ws, req, next) => {
  logger.error('old ws path /ws is not working anymore');
});

app.use(Express.static(path.join(__dirname, './static')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next(createError(404));
  res.status(404).send('Requested resource not found');
  // const indexHtml = path.join(__dirname, './static', '/index.html');
  // res.sendFile(indexHtml);
});

// error handler
// @ts-ignore
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.info('error on request', req.headers, err.toString());

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: err });
});

