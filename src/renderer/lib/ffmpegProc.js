const { EventEmitter } = require('events');
const { spawnChild } = require('./spawnChild');
const config = require('./config.json');

const {
  FFMPEG_BIN = 'c:/Users/user/Downloads/sendust-transcoder/bin/ffmpeg2018',
  FFMPEG_ARGS = '-av copy',
  FFMPEG_OPTS = {},
  FFMPEG_PROGRESS_LINE_REGEXP = '^frame=',
} = config;

const mkSpawnArgs = (inFile, args, outFile) => {
  const stringArgs = typeof args === 'string' ? args : args.join(' ');
  return `-i ${inFile} ${stringArgs} ${outFile}`;
};

const stringToArray = (line, sep = ' ') => line.split(sep);
const arrayToObject = (array, sep = '=') =>
  array.reduce((acc, element) => {
    const array = stringToArray(element, sep);
    const key = array[0];
    const value = array[1];
    acc[key] = value;
    return acc;
  }, {});

const parseProgressLine = (ffmpegProgressLine) => {
  const arrayOfLines = stringToArray(ffmpegProgressLine, '\n');
  return arrayToObject(arrayOfLines, '=');
};

const ffmpegStdoutParser = (line) => {
  const isProgressLine = RegExp(FFMPEG_PROGRESS_LINE_REGEXP).test(line);
  const progressObj = isProgressLine ? parseProgressLine(line) : {};
  return {
    isProgress: isProgressLine,
    progressObj,
    line,
  };
};

const progressEmitter = (worker, totalFrames) => {
  return (outputLine) => {
    const parsed = ffmpegStdoutParser(outputLine.toString());
    const { frame, progress } = parsed.progressObj;
    const percent =
      progress === 'end' ? 100.0 : ((frame * 100) / totalFrames).toFixed(1);
    worker.emit('progress', {
      percent,
      ...parsed.progressObj,
    });
  };
};

class FFMPEG extends EventEmitter {
  constructor(opts) {
    super();
    const { inFile = 'sample_in.mp4', outFile = 'sample_out.mp4' } = opts;
    const { args = FFMPEG_ARGS } = opts;
    const spawnArgs = mkSpawnArgs(inFile, args, outFile);
    this.proc = spawnChild({
      binary: FFMPEG_BIN,
      args: spawnArgs,
      options: FFMPEG_OPTS,
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

const ffmpeg = (options) => {
  const worker = new FFMPEG(options);
  const { totalFrames } = options;
  worker.spawnHandler = () => {
    worker.emit('ready');
  };
  worker.exitHandler = (code) => {
    worker.emit('exit');
  };
  worker.stdoutHandler = progressEmitter(worker, totalFrames);
  return worker;
};

module.exports = ffmpeg;
