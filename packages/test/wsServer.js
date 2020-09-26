const express = require('express');
const cors = require('cors');

const app = express();
const expressWs = require('express-ws')(app);

app.use(cors());

// app.use((req, res, next) => {
//   console.log('middleware');
//   req.testing = 'testing';
//   return next();
// });

// app.get('/', (req, res, next) => {
//   console.log('get route', req.testing);
//   res.end();
// });

app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.listen(3001);
