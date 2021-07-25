// const createError = require('http-errors');
import Express from 'express';
import ExpressWs from 'express-ws';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morganLogger from 'morgan';
import shortid from 'shortid';
import cors from 'cors';
import * as core from 'express-serve-static-core';

import { 
  PlayerAuthorizedRequest,
  winstonLogger,
  playerServerConstants,
  createLogger,
  CharacterWatcher,
} from 'sr2020-mm-server-event-engine';
import { makeGameModel } from "./gameModel";

import { pingRouter } from './routes/ping'; 
import { loginRouter } from './routes/login'; 
import { parseUserData } from './routes/parseUserData'; 
import { postUserPosition } from './routes/postUserPosition';

import { SsePlayerDataSender } from './ssePlayerDataSender';
import { spiritRouter } from "./routes/spirits";
import { logoutRouter } from "./routes/logout";
import { connectToMainServerSse } from './routes/playerDataSse';
import { refreshCharacterModelRouter } from './routes/refreshCharacterModel';
import { loadHistory } from './routes/loadHistory';
import { testSuitDispirit } from './testSuitDispirit';

const logger = createLogger('playerServer/app.ts');

logger.info('process.env.NODE_ENV', process.env.NODE_ENV);

const { gameModel, gameServer } = makeGameModel();
const characterWatcher = new CharacterWatcher();
characterWatcher.start();

export const app: core.Express = Express();
const wsApp = ExpressWs(app);

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

const allowedOrigins = [
  // webpack local server
  'http://localhost:3000', 
  'http://localhost:3002',
  'http://localhost:3002/',
  'https://magic.evarun.ru'
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

app.use((req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  // we need characterWatcher in parseUserData
  req.characterWatcher = characterWatcher;
  next();
});

app.use(loginRouter);

app.use('/api', parseUserData);

app.use((req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  req.gameModel = gameModel;
  next();
});

app.use('/api', spiritRouter);

app.use('/api', logoutRouter);

app.use('/api', refreshCharacterModelRouter);

app.use('/api', postUserPosition);

app.get('/api/loadHistory', loadHistory);

app.get('/api/singlePlayerDataSse', (req, res, next) => {
  logger.info('Processing playerDataSse connection');
  const { userData, characterWatcher, characterModelData } = req as PlayerAuthorizedRequest;
  const ip = req.connection.remoteAddress;
  const id = shortid.generate();
  const childLogger = winstonLogger.customChild ? 
    winstonLogger.customChild(winstonLogger, { service: `player_session_${id}` }) :
    winstonLogger;
  childLogger.info(ip);
  new SsePlayerDataSender(
    req, 
    res, 
    next, 
    childLogger, 
    gameModel, 
    userData, 
    characterWatcher,
    characterModelData
  );
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

connectToMainServerSse(gameModel);

testSuitDispirit();