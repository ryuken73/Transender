import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import ffmpegProc from 'renderer/lib/ffmpegProc';
import bullConstants from 'renderer/config/bull-constants';

const mediainfoBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const ffmpegBinary = getAbsolutePath('bin/ffmpeg2018.exe', true);
const ffmpeg = ffmpegProc(ffmpegBinary);
const ffmpegQueue = getQueue('ffmpeg', bullConstants);

// const getMediainfoQueue = () => mediainfoQueue;
const addMediainfoQueue = (task, job) => {
  return mediainfoQueue.add({
    ...task,
    inputFile: job.sourceFile.fullName,
    },
    task.taskId
  );
};
const addFFmpegQueue = (task) => {
  return ffmpegQueue.add({
    ...task,
    },
    task.taskId
  );
};

module.exports = {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
  ffmpeg,
  ffmpegQueue,
  addFFmpegQueue,
};
