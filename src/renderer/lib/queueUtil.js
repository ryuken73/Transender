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

const { TASK_TYPES } = bullConstants;

// const queuesArray = [ mediainfoQueue, ffmpegQueue, virusScanQueue, sendFileQueue];
const queues = {
  [TASK_TYPES.MEDIAINFO]: mediainfoQueue,
  [TASK_TYPES.TRANSCODE]: ffmpegQueue,
  [TASK_TYPES.VIRUS_SCAN]: virusScanQueue,
  [TASK_TYPES.SEND_FILE]: sendFileQueue,
};

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
const moveQItemStatus = (task, fromStatus, toStatus) => {
  queues.values.forEach((queue) => {
    if (queue.hasQItem(task.taskId)) {
      queue.moveItemStatus(task.taskId, fromStatus, toStatus);
    }
  });
};
const removeQItemFromQueue = (task) => {
  console.log('remove qItem(task) = ', task);
  console.log('current Queues', queues);
  queues.values.forEach((queue) => {
    if (queue.hasQItem(task.taskId)) {
      console.log('remove qItem from :', queue);
      queue.removeFromQueue(task.taskId);
    }
  });
};
const setConcurrency = (queueType, concurrency) => {
  queues[queueType].concurrency = concurrency;
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
  moveQItemStatus,
  removeQItemFromQueue,
  setConcurrency,
};
