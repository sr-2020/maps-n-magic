// const winston = require('winston');
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import util from 'util';
import * as R from 'ramda';
import { GMLogger } from "sr2020-mm-event-engine";

const {
  combine, timestamp, label, printf,
} = winston.format;

const myFormat = printf(({
  level, message, label, timestamp, service, stack,
}) => {
  // if (label) {
  //   return `${timestamp} [${label}] ${level}: ${message}`;
  // }
  if (service) {
    return `${timestamp} [${service}] ${level}: ${message} ${stack || ''}`;
  }
  return `${timestamp} ${level}: ${stack || ''}`;
});

function objectConverter(key: unknown, value: unknown) {
  if (value instanceof Map || value instanceof Set) return [...value];
  return value;
}

function transform(info: {
  message: string,
}, opts: unknown) {
  // console.log('info', info);
  // console.log('opts', opts);
  // console.log('this', this);
  // @ts-ignore
  const args = info[Symbol.for('splat')];
  // if (args) { info.message = util.format(info.message, ...args); }
  let arr = [info.message];
  if (args) {
    arr = [info.message, ...args];
    // @ts-ignore
    info[Symbol.for('splat')] = [];
  }
  info.message = arr.map((el) => {
    // console.log('echo', el, el instanceof Error, R.is(Object, el), R.is(String, el));
    // if (el instanceof Error) {
    // // console.log('item', el);
    //   return el.stack;
    // }
    if (R.is(Object, el)) {
      // return JSON.stringify(el, null, '  ');
      return JSON.stringify(el, objectConverter, '  ');
    }
    return el;
  }).join(' ');
  return info;
}

function utilFormatter() { return { transform }; }

const customFormat = combine(
  // label({ label: 'root' }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  // @ts-ignore
  utilFormatter(),
  myFormat,
);

export const winstonLogger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: customFormat,
  defaultMeta: { service: 'root' },
  // defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
    new DailyRotateFile({
      filename: 'map-n-magic-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      dirname: 'logs',
      // colorize: false,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      dirname: 'logs',
      filename: 'exceptions.log',
    }),
  ],

  // rejectionHandlers: [
  //   new winston.transports.File({ dirname: 'logs', filename: 'rejections.log' }),
  // ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    // format: winston.format.simple(),
    // format: winston.format.simple(),
    format: customFormat,
    handleExceptions: true,
    // handleRejections: true,
  }));
}

winstonLogger.stream = {
  // @ts-ignore
  write(message, encoding) {
    winstonLogger.info(message);
  },
};

function customChild(logger: GMLogger, defaultMeta: object) {
  if(logger.child) {
    const childLogger = logger.child({});
    childLogger.defaultMeta = { ...logger.defaultMeta, ...defaultMeta };
    childLogger.customChild = customChild;
    return childLogger;
  }
  return logger;
}

// @ts-ignore
winstonLogger.customChild = customChild;

// winstonLogger.defaultMeta = { service: 'root2323' };

// console.log(winstonLogger);
