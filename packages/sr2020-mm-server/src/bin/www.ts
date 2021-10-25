#!/usr/bin/env node

/**
 * Module dependencies.
 */

// const debug = require('debug')('audio-retranslator:server');
// const http = require('http');
import { createLogger } from 'sr2020-mm-server-event-engine';
import { app } from '../app';

const logger = createLogger('mainServer/bin/www.ts');
// const app = require('../app');

/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '3000');
const port = normalizePort(process.env.PORT || '3010');
app.set('port', port);
logger.info('main server port', port);

app.listen(port);

// /**
//  * Create HTTP server.
//  */

// const server = http.createServer(app);

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | number {
  if (typeof val === 'string') {
    const port2 = parseInt(val, 10);
  
    if (Number.isNaN(port2)) {
      // named pipe
      // return val;
      throw new Error('Port is not a number: ' + val);
    }
    if (port2 >= 0) {
      // port number
      return port2;
    }
  }
  throw new Error('Port is not a string: ' + val);
}

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   const bind = typeof port === 'string'
//     ? `Pipe ${port}`
//     : `Port ${port}`;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//   case 'EACCES':
//     console.error(`${bind} requires elevated privileges`);
//     process.exit(1);
//     process.exit(1);
//     break;
//     throw error;
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening() {
//   const addr = server.address();
//   const bind = typeof addr === 'string'
//     ? `pipe ${addr}`
//     : `port ${addr.port}`;
//   debug(`Listening on ${bind}`);
// }
