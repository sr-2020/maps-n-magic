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
import * as jwt from "jsonwebtoken";

import { 
  AuthorizedRequest, 
  winstonLogger,
  playerServerConstants,
  createLogger
} from 'sr2020-mm-server-event-engine';
import { makeGameModel } from "./gameModel";

import { pingRouter } from './routes/ping'; 
import { loginRouter } from './routes/login'; 
import { parseUserData } from './routes/parseUserData'; 
import { postUserPosition } from './routes/postUserPosition';
import { 
  ELocationRecordsChanged2, 
  ESetSpirits, 
  ESpiritsChanged, 
  EUserRecordsChanged, 
  SetLocationRecords, 
  SetUserRecords 
} from 'sr2020-mm-event-engine';
import { SsePlayerDataSender } from './ssePlayerDataSender';
import { spiritRouter } from "./routes/spirits";
import { logoutRouter } from "./routes/logout";

const logger = createLogger('playerServer/app.ts');

logger.info('process.env.NODE_ENV', process.env.NODE_ENV);

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

app.get('/ping', pingRouter);
app.use(loginRouter);

app.use('/api', parseUserData);

app.use(spiritRouter);

app.use('/api', logoutRouter);

app.get('/api/singlePlayerDataSse', (req, res, next) => {
  logger.info('Processing playerDataSse connection');
  const { userData } = req as AuthorizedRequest;
  const ip = req.connection.remoteAddress;
  const id = shortid.generate();
  const childLogger = winstonLogger.customChild ? 
    winstonLogger.customChild(winstonLogger, { service: `player_session_${id}` }) :
    winstonLogger;
  childLogger.info(ip);
  new SsePlayerDataSender(req, res, next, childLogger, gameModel, userData);
});

app.use(Express.static(path.join(__dirname, './static')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next(createError(404));
  res.status(404).send('Requested resource not found');
  // res.sendFile(path.join(__dirname, './static', '/index.html'));
});

// error handler
// @ts-ignore
app.use((err, req: Request, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // @ts-ignore
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.info('error on request', req.headers, err.toString());

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

const playerServerToken = jwt.sign(
  playerServerConstants().playerServerTokenPayload, 
  playerServerConstants().JWT_SECRET
);

const es = new EventSource(playerServerConstants().playerDataSseUrl, {
  headers: {
    'Cookie': 'mm_token=' + playerServerToken
  }
});

// logger.info('main server es.readyState', es.readyState);

es.onopen = function(event) {
  logger.info("EventSource onopen", event);
};
// es.onmessage = function(event) {
//   logger.info("EventSource onmessage", event);
// };
es.onerror = function(event) {
  logger.info("EventSource onerror", event);
};

es.addEventListener('message', function (e) {
  try {
    const { data }: { data: string } = e;
    const parsedData: unknown = JSON.parse(data);
    if (isSpiritsChanged(parsedData)) {
      logger.info(parsedData.type);
      gameModel.emit2<ESetSpirits>({
        ...parsedData,
        type: 'setSpirits',
      });
    } else if(isLocationRecordsChanged(parsedData)) {
      logger.info(parsedData.type);
      gameModel.execute2<SetLocationRecords>({
        ...parsedData,
        type: 'setLocationRecords',
      });
    } else if(isUserRecordsChanged(parsedData)) {
      logger.info(parsedData.type);
      gameModel.execute2<SetUserRecords>({
        ...parsedData,
        type: 'setUserRecords',
      });
    } else {
      logger.warn(`Unexpected sse message data ${JSON.stringify(e)}`);
    }
  } catch (err) {
    logger.error('error', err);
    logger.error(`Error on processing sse message: ${JSON.stringify(err)}, message ${JSON.stringify(e)}`)
  }
})