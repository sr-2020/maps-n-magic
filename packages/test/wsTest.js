const W3CWebSocket = require('websocket').w3cwebsocket;

const socket = new W3CWebSocket('ws://localhost:3001/ws');

// socket.onerror = function (error) {
//   console.log('Connection Error', error);
// };

// socket.onopen = function () {
//   console.log('WebSocket Client Connected');

//   function sendNumber() {
//     if (socket.readyState === socket.OPEN) {
//       const number = Math.round(Math.random() * 0xFFFFFF);
//       socket.send(number.toString());
//       setTimeout(sendNumber, 1000);
//     }
//   }
//   sendNumber();
// };

// socket.onclose = function () {
//   console.log('echo-protocol Client Closed');
// };

// socket.onmessage = function (e) {
//   if (typeof e.data === 'string') {
//     console.log(`Received: '${e.data}'`);
//   }
// };

socket.onopen = function (e) {
  console.log('[open] Соединение установлено');
  console.log('Отправляем данные на сервер');
  socket.send('Меня зовут Джон');
};

socket.onmessage = function (event) {
  console.log(`[message] Данные получены с сервера: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
  } else {
    // например, сервер убил процесс или сеть недоступна
    // обычно в этом случае event.code 1006
    console.log('[close] Соединение прервано');
  }
};

socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};

let i = 0;
setInterval(() => {
  if (socket.readyState === 1) {
    socket.send(`Message ${i++}`);
  }
  // if (socket.bufferedAmount == 0) {
  // }
}, 100);
