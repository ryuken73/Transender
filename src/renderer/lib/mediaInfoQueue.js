import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';

const mediainfoBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const getMediainfoQueue = () => mediainfoQueue;

const addQueue = (task, job) => {
  return mediainfoQueue.add({
    ...task,
    inFile: job.sourceFile.fullName,
    },
    task.taskId
  );
};

// module.exports = { getMediainfoQueue, startMediainfoQueue, addQueue };
module.exports = { getMediainfoQueue, addQueue };
