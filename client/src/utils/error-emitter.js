import { EventEmitter } from 'events';

class ErrorEmitter extends EventEmitter {
  dispatch(message) {
    this.emit('error', message);
  }

  close() {
    this.emit('close');
  }
}

const errorEmitter = new ErrorEmitter();

export default errorEmitter;
