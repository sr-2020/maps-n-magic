import EventEmitter from 'events';
import { WS_URL } from '../settings';

export class WSConnector extends EventEmitter {
  constructor(gameModel) {
    super();
    this.gameModel = gameModel;
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.socket = null;
    this.initConnection();
    // this.isAlive = false;
  }

  initConnection() {
    this.destroySocket();
    const socket = new WebSocket(WS_URL);
    socket.onopen = this.onOpen;
    socket.onmessage = this.onMessage;
    socket.onclose = this.onClose;
    socket.onerror = this.onError;
    this.socket = socket;
  }

  destroySocket() {
    if (this.socket === null) {
      return;
    }
    try {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
    } catch (err) {
      console.log(err);
    }
  }

  onOpen(event) {
    console.log('[open] WebSocket open');
    this.emit('onOpen');
    // this.isAlive = true;
  }

  onMessage(event) {
    // console.log(`[message] Received data from server: ${event.data}`);
    this.emit('onMessage', JSON.parse(event.data));
  }

  onClose(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // For example, server killed process or network is not available
      // usually it returns event.code 1006
      console.log('[close] Connection interrupted, event.code', event.code);
    }
    // this.isAlive = false;
    this.initConnection();
  }

  onError(error) {
    console.log(`[error] ${error.message}`);
    // this.isAlive = false;
    this.initConnection();
  }

  send(object) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify(object));
      return 0;
    }
    console.error('socket is not ready for event emitting, readyState', this.socket && this.socket.readyState);
    return 1;
  }
}
