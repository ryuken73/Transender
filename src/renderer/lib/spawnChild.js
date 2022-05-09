const child_process = require('child_process');

const controller = new AbortController();
const { signal } = controller;

class CP {
  constructor(props) {
    let binary;
    let args;
    if (typeof props === 'string') {
      [binary, ...args] = props.split(' ');
    } else {
      binary = props.binary;
      args = props.args;
    }
    this._binary = binary;
    this._args = Array.isArray(args)
      ? args
      : typeof args === 'string'
      ? args.split(' ')
      : [];
    this._options = { signal, ...props.options } || { signal };
    this._handleStdout = (data) => console.log(data.toString());
    this._handleStderr = (data) => console.log(data.toString());
    this._handleError = (error) => console.log(error);
    this._handleSpawn = () => console.log('child process started.');
    this._handleExit = (code) =>
      console.log('child process exited. exit code:', code);
  }

  start = () => {
    console.log(this._binary, this._args)
    this.process = child_process.spawn(this._binary, this._args, this._options);
    this.process.stdout.on('data', (data) => this.handleStdout(data));
    this.process.stderr.on('data', (data) => this.handleStderr(data));
    this.process.on('error', (error) => {
      if (error.code === 'ABORT_ERR') {
        console.log('operation aborted!');
        return;
      }
      this.handleError(error);
    });
    this.process.on('spawn', () => this.handleSpawn());
    this.process.on('exit', (code) => this.handleExit(code));
  };

  run = () => {
    this.start();
  };

  stop = () => {
    controller.abort();
    this.process = {};
  };

  get handleStdout() {
    return this._handleStdout;
  }

  get handleStderr() {
    return this._handleStderr;
  }

  get handleError() {
    return this._handleError;
  }

  get handleSpawn() {
    return this._handleSpawn;
  }

  get handleError() {
    return this._handleError;
  }

  get handleExit() {
    return this._handleExit;
  }

  set stdoutHandler(handler) {
    this._handleStdout = handler;
  }

  set stderrHandler(handler) {
    this._handleStderr = handler;
  }

  set errorHandler(handler) {
    this._handleError = handler;
  }

  set spawnHandler(handler) {
    this._handleSpawn = handler;
  }

  set exitHandler(handler) {
    this._handleExit = handler;
  }

  set bin(binary) {
    this._binary = binary;
  }

  set args(spawnArgs) {
    this._args = Array.isArray(spawnArgs)
      ? spawnArgs
      : typeof spawnArgs === 'string'
      ? spawnArgs.split(' ')
      : [];
  }

  set options(opts) {
    this._options = { signal, ...opts };
  }
}

const spawnChild = (options) => {
  const cp = new CP(options);
  return cp;
};

module.exports = {
  spawnChild,
};
