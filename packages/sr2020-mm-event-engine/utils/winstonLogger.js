// const winston = require('winston');
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import util from 'util';
import * as R from 'ramda';

const {
  combine, timestamp, label, printf,
} = winston.format;

const myFormat = printf(({
  level, message, label, timestamp,
}) => {
  if (label) {
    return `${timestamp} [${label}] ${level}: ${message}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

function transform(info, opts) {
  // console.log('info', info);
  // console.log('opts', opts);
  const args = info[Symbol.for('splat')];
  // if (args) { info.message = util.format(info.message, ...args); }
  if (args) {
    info.message = [info.message, ...args].map((el) => {
      if (R.is(Object, el)) {
        return JSON.stringify(el, null, '  ');
      }
      return el;
    }).join(' ');
    info[Symbol.for('splat')] = [];
  }
  return info;
}

function utilFormatter() { return { transform }; }

const customFormat = combine(
  // label({ label: 'right meow!' }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  utilFormatter(),
  // timestamp(),
  myFormat,
);

export const winstonLogger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: customFormat,
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
  write(message, encoding) {
    winstonLogger.info(message);
  },
};
