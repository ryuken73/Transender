const ffmpegBin = require('./ffmpegProc');

const main = (ffmpegBinary) => {
  const ffmpegProc = ffmpegBin(ffmpegBinary);
  const ffmpeg = ffmpegProc.run({
    inFile: 'd:/temp/the guest 1.mp4',
    ffmpegOptions: '-y -acodec copy -progress pipe:1',
    outFile: 'd:/temp/xxx.mp4',
    totalFrames: 1000,
  });
  ffmpeg.on('progress', (progress) => console.log(progress));
  process.stdin.on('data', () => ffmpegProc.stop());
};

main();
