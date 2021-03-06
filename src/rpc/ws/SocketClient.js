import { EventEmitter } from 'events';
import { generate as uuid } from 'shortid';

class SocketClient extends EventEmitter {
  constructor() {
    super();

    this._webSocket = null;
    this._isOpen = null;
    this._postponedRequests = [];
  }

  connect(address, port) {
    const url = `ws://${address}:${port}/jsonrpc`;
    this._webSocket = new WebSocket(url);

    this._webSocket.onopen = (event) => {
      this.emit('open', event)
      this._isOpen = true;

      this._processPostponedRequests();
    };

    this._webSocket.onerror = (event) => {
      this.emit('error', event);
      this._isOpen = false;
    };

    this._webSocket.onclose = (event) => {
      this.emit('close', event);
      this._isOpen = false;
    };

    this._webSocket.onmessage = (event) => {
      this.emit('message', event, JSON.parse(event.data));

      try {
        const parsedData = JSON.parse(event.data);
        this.emit(`request:${parsedData.id}`, null, parsedData, event);
      } catch(e) {
        this.emit('parse-error', e);
      }
    };
  }

  close() {
    if(!this._isOpen) {
      return;
    }

    this._webSocket.close();
  }

  send(method, params, id = 'ARNOLD') {
    if(!this._isOpen) {
      return;
    }

    let message = {
      jsonrpc: '2.0',
      method: method,
      id,
      params
    };

    this._webSocket.send(JSON.stringify(message));
  }

  request(method, params, callback) {
    if(!this._isOpen) {
      this._postponeRequest(method, params, callback);
      return;
    }

    const id = uuid();
    this.send(method, params, id);
    this.once(`request:${id}`, callback);
  }

  _postponeRequest(method, params, callback) {
    this._postponedRequests.push({
      method,
      params,
      callback
    });
  }

  _processPostponedRequests() {
    let postponedRequest = this._postponedRequests.shift();

    while(postponedRequest !== undefined) {
      const { method, params, callback } = postponedRequest;
      this.request(method, params, callback);

      postponedRequest = this._postponedRequests.shift();
    }
  }
}

export default SocketClient;
