/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import { addMediainfoQueue } from 'renderer/lib/queueUtil';

const { file } = require('renderer/utils');
const { changeDir, changeExtension } = file;

const { FFMPEG_OPTIONS } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

const makeFFmpegOptions = (video, audio) => {
  const toMxfOption = FFMPEG_OPTIONS.MXF.join(' ');
  // return '-y -acodec copy -progress pipe:1';
  return toMxfOption;
};
const makeFFmpegOutPath = (job) => {
  const origFile = job.sourceFile.fullName;
  const targetFile = changeDir(
    changeExtension(origFile, '.mxf'),
    'd:/temp/transender'
  );
  return targetFile;
};

export default function useMediainfoAdd(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { updateJobTask, updateJobStatusState } = useJobItemState(jobId);
  const addMediainfoItem = React.useCallback(
    (task) => {
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addMediainfoQueue(task, job);
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        // eslint-disable-next-line prettier/prettier
        const activeTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.ACTIVE});
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { rawResult, video, audio } = result;
        // eslint-disable-next-line prettier/prettier
        const completedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.COMPLETED});
        console.log('&&&&', video('FrameCount'));
        const ffmpegOptions = makeFFmpegOptions(video, audio);
        const totalFrames = video('FrameCount')[0];
        const outFile = makeFFmpegOutPath(job);
        const updatedTask = getNextTaskUpdated({
          inFile: job.sourceFile.fullName,
          ffmpegOptions,
          totalFrames,
          outFile,
        });
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        // eslint-disable-next-line prettier/prettier
        const failedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.FAILED});
        updateJobTask([failedTask]);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [job, updateJobStatusState, updateJobTask]
  );

  return { addMediainfoItem, };
}
