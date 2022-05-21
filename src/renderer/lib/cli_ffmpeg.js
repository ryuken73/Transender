const ffmpegBin = require('./ffmpegProc');
const { initElectronLog, createLogger } = require('./electronUtil');

// const main = (ffmpegBinary) => {
//   const ffmpegProc = ffmpegBin(ffmpegBinary);
//   const ffmpeg = ffmpegProc.run({
//     inFile: 'd:/temp/the guest 1.mp4',
//     ffmpegOptions: '-y -acodec copy -progress pipe:1',
//     outFile: 'd:/temp/xxx.mp4',
//     totalFrames: 1000,
//   });
//   ffmpeg.on('progress', (progress) => console.log(progress));
//   process.stdin.on('data', () => ffmpegProc.stop());
// };

const logger = createLogger('ffmpeg');

const main = (ffmpegBinary) => {
  const options = [
    {
      inFile: 'd:/temp/the guest 1.mp4',
      ffmpegOptions: '-y -acodec copy -progress pipe:1',
      outFile: 'd:/temp/xxx.mp4',
      totalFrames: 1000,
    },
    {
      inFile: 'd:/project/003.electron/HLS-Stream-Recorder/src/bin/9990.mp4',
      ffmpegOptions: '-y -acodec copy -progress pipe:1',
      outFile: 'd:/temp/xxx.mp4',
      totalFrames: 1000,
    },
  ];
  const procs = options.map(option => {
    const ffmpegProc = ffmpegBin(ffmpegBinary,{},logger);
    const ffmpeg = ffmpegProc.run(option);
    // ffmpeg.on('progress', (progress) =>
    //   console.log(`${ffmpeg.pid}:`, progress)
    // );
    return ffmpeg;
  })
  process.stdin.on('data', () => {
    procs.forEach(proc => proc.stop());
  });
}

main();
