const { spawn } = require('child_process');
const controller = new AbortController();
const { signal } = controller;

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
}

const ffmpeg = (
  binaryPath = `${process.cwd()}/../../bin/ffmpeg2018.exe`,
  spawnOptions = {}
) => {
  let childProcess;
  const run = ({ inFile, ffmpegOptions, outFile, totalFrames }) => {
    console.log(ffmpegOptions.split(' '))
    const spawnArgs = ['-i', inFile, ...ffmpegOptions.split(' '), outFile];
    const spawnOpts = { signal, ...spawnOptions };
    childProcess = spawn(binaryPath, spawnArgs, spawnOpts);
    childProcess.userDefined = { totalFrames };
    childProcess.on('error', (error) => {
      if (error.code === 'ABORT_ERR'){
        console.log('force stopped')
        childProcess.emit('force-stopped');
        return;
      }
      console.log(error)
    });
    childProcess.on('exit', (code) => {
      console.log('exit ffmpeg')
    });
    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
      const progressObj = getProgressObj(data.toString());
      if (progressObj !== null) {
        childProcess.emit('progress', progressObj);
      }
    });
    childProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    return childProcess;
  };

  const stop = () => controller.abort();
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
