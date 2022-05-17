const { spawn } = require('child_process');
// const { signal } = controller;

const FFMPEG_ERROR_LINE_REGEXP = '.*Error.*|.*Invalid.*';
const FFMPEG_PROGRESS_LINE_REGEXP = '^frame=';
const jsUtil = {
  stringToArray(line, sep = ' ') {
    return line.split(sep);
  },
  arrayToObject(array, sep = '='){
    return array.reduce((acc, element) => {
      const arrayTemp = jsUtil.stringToArray(element, sep);
      const key = arrayTemp[0];
      const value = arrayTemp[1];
      acc[key] = value;
      return acc;
    }, {});
  }
}
const getProgressObj = (line) => {
  if (!RegExp(FFMPEG_PROGRESS_LINE_REGEXP).test(line)) {
    return null;
  };
  const arrayOfLines = jsUtil.stringToArray(line, '\n');
  return jsUtil.arrayToObject(arrayOfLines, '=');
};

const hasFFmpegErrorString = (line) => {
  return RegExp(FFMPEG_ERROR_LINE_REGEXP).test(line);
};

const ffmpeg = (
  binaryPath = `${process.cwd()}/../../bin/ffmpeg2018.exe`,
  spawnOptions = {}
) => {
  let childProcess;
  let controller;
  const run = ({ inFile, ffmpegOptions, outFile, totalFrames }) => {
    console.log(ffmpegOptions.split(' '))
    controller = new AbortController();
    const { signal } = controller;
    const spawnArgs = ['-i', inFile, ...ffmpegOptions.split(' '), outFile];
    const spawnOpts = { signal, ...spawnOptions };
    childProcess = spawn(binaryPath, spawnArgs, spawnOpts);
    childProcess.userDefined = { totalFrames };
    childProcess.on('error', (error) => {
      console.error(error)
      if (error.code === 'ABORT_ERR'){
        console.log('force stopped')
        childProcess.emit('force-stopped');
        return;
      }
      console.log(error)
    });
    childProcess.on('exit', (code) => {
      console.log('exit ffmpeg: code= ', code);
      childProcess.emit('done');
    });
    childProcess.stdout.on('data', (data) => {
      console.log('stdout >>', data.toString());
      const progressObj = getProgressObj(data.toString());
      if (progressObj !== null) {
        childProcess.emit('progress', progressObj);
      }
    });
    childProcess.stderr.on('data', (data) => {
      console.log('stderr >>', data.toString());
      if(hasFFmpegErrorString(data.toString())){
        console.error('there are some errors in stderr.', data.toString());
        stop();
      }
    });
    return childProcess;
  };

  const stop = () => {
    console.log('&&& manual stop called!');
    controller.abort();
  }
  const getPID = () => childProcess.pid;
  const getCmdParams = () => childProcess.spawnargs;

  return {
    run,
    stop,
    getPID,
    getCmdParams
  };
};

module.exports = ffmpeg;
