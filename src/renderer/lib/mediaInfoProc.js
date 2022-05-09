const { EventEmitter } = require('events');
const { getAbsolutePath } = require('./electronUtil');
const { spawnChild } = require('./spawnChild');

// const mediainfoBinary = getAbsolutePath('bin/mediainfo.exe', true);
const mediainfoBinary = '../../bin/Mediainfo.exe';


const mkSpawnArgs = (inFile, args) => {
  const stringArgs = typeof args === 'string' ? args : args.join(' ');
  return `${inFile} ${stringArgs}`;
};

class MEDIAINFO extends EventEmitter {
  constructor(opts) {
    super();
    const { inFile = 'sample_in.mp4' } = opts;
    const { args = '' } = opts;
    const spawnArgs = mkSpawnArgs(inFile, args);
    console.log(spawnArgs)
    this.proc = spawnChild({
      binary: mediainfoBinary,
      args: spawnArgs,
      options: {},
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

const mediainfo = (options) => {
  const worker = new MEDIAINFO(options);
  worker.stdoutHandler = (line) => {
    console.log('ouput line:', line.toString());
    worker.emit('frames', line.toString());
  };
  worker.spawnHandler = () => {
    console.log('mediainfo ready');
  };
  worker.exitHandler = (code) => {
    console.log('mediainfo stopped with code: ', code);
  };
  return worker;
};

module.exports = mediainfo;
