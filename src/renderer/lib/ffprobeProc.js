const { EventEmitter } = require('events');
const { spawnChild } = require('./spawnChild');
const config = require('./config.json');

const {
  FFPROBE_BIN = 'ffprobe.exe',
  FFPROBE_ARGS = '',
  FFPROBE_OPTS = {},
} = config;

const mkSpawnArgs = (inFile, args) => {
  const stringArgs = typeof args === 'string' ? args : args.join(' ');
  return `${stringArgs} ${inFile}`;
};

class FFPROBE extends EventEmitter {
  constructor(opts) {
    super();
    const { inFile = 'sample_in.mp4' } = opts;
    const { args = FFPROBE_ARGS } = opts;
    const spawnArgs = mkSpawnArgs(inFile, args);
    this.proc = spawnChild({
      binary: FFPROBE_BIN,
      args: spawnArgs,
      options: FFPROBE_OPTS,
    });
    return this;
  }

  start = () => {
    this.proc.start();
  };

  set stdoutHandler(handler) {
    this.proc.stdoutHandler = handler;
  }

  set spawnHandler(handler) {
    this.proc.spawnHandler = handler;
  }

  set exitHandler(handler) {
    this.proc.exitHandler = handler;
  }
}

const ffprobe = (options) => {
  const worker = new FFPROBE(options);
  worker.stdoutHandler = (line) => {
    console.log('ouput line:', line.toString());
    worker.emit('frames', line.toString());
  };
  worker.spawnHandler = () => {
    console.log('ffprobe ready');
  };
  worker.exitHandler = (code) => {
    console.log('ffprobe stopped with code: ', code);
  };
  return worker;
};

module.exports = ffprobe;
