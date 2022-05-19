import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
// import ffmpegProc from 'renderer/lib/ffmpegProc';
import virusScanProc from 'renderer/lib/virusScanProc';
// import sendFileProc from 'renderer/lib/sendFileProc';
import bullConstants from 'renderer/config/bull-constants';

const mediainfoBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const ffmpegBinary = getAbsolutePath('bin/ffmpeg2018.exe', true);
const ffmpegQueue = getQueue('ffmpeg', bullConstants);

const virusScanBinary = 'virusScan.exe';
const virusScan = virusScanProc(virusScanBinary);
const virusScanQueue = getQueue('virusScan', bullConstants);

// const sendFile = sendFileProc();
const sendFileQueue = getQueue('sendFile', bullConstants);

// const getMediainfoQueue = () => mediainfoQueue;
const addMediainfoQueue = (task, job) => {
  return mediainfoQueue.add({
    ...task,
    inFile: job.sourceFile.fullName,
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
const addVirusScanQueue = (task) => {
  return virusScanQueue.add({
    ...task,
    },
    task.taskId
  );
};
const addSendFileQueue = (task) => {
  return sendFileQueue.add({
    ...task,
    },
    task.taskId
  );
};
module.exports = {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
  ffmpegQueue,
  addFFmpegQueue,
  virusScan,
  virusScanQueue,
  addVirusScanQueue,
  // sendFile,
  sendFileQueue,
  addSendFileQueue,
};
