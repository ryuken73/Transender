const mediainfoProc = require('./mediaInfoProc');

const main = async () => {
  const mediainfo = mediainfoProc();
  await mediainfo.run('d:/temp/the guest 1.mp4');
  console.log(mediainfo.getGeneral());
  const Video = mediainfo.getStreams('Video');
  const Audio = mediainfo.getStreams('Audio');
  console.log(Video('Duration'))
  console.log(Audio('Format'))
}

main();
