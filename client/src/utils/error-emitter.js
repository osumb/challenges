import { EventEmitter } from 'events';

class ErrorEmitter extends EventEmitter {
  dispatch(message) {
    this.emit('error', message);
  }
}

const errorEmitter = new ErrorEmitter();

export default errorEmitter;
