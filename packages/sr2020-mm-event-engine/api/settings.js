let WS_URL;
if (process.env.NODE_ENV === 'production') {
  WS_URL = 'wss://maps-n-magic.evarun.ru/ws';
} else {
  WS_URL = 'ws://localhost:3001/ws';
}

export { WS_URL };
