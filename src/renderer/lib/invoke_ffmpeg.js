// const ffmpeg = require('./ffmpegProc');
// const ffprobe = require('./ffprobeProc');
const mediainfo = require('./mediaInfoProc');

// const inFile = `d:/temp/cctv/channel1/channel1_20201204.201512_[00;00;38.37].mp4`;
const inFile = ['d:/temp/the guest 1.mp4'];
const args = '--output=JSON'
const outFile = `out.mxf`;

const mediainfoWorker = mediainfo({inFile, args});
mediainfoWorker.start();
// const ffprobeWorker = ffprobe({ inFile });
// const getFrame = (ffprobe) => {
//   return new Promise((resolve, reject) => {
//     console.log('in promise');
//     ffprobe.on('frames', resolve);
//   });
// };

// async function main() {
//   ffprobeWorker.start();
//   const frames = await getFrame(ffprobeWorker);
//   console.log(frames);
//   const ffmpegWorker = ffmpeg({
//     inFile,
//     outFile,
//     totalFrames: frames,
//   });
//   ffmpegWorker.on('ready', () => console.log(`ready`));
//   ffmpegWorker.on('exit', () => console.log(`exit`));
//   ffmpegWorker.on('progress', (progress) =>
//     console.log(`${progress.percent}%`)
//   );
//   ffmpegWorker.start();
// }

// main();
