/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
import React from 'react';
import { useSelector } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useAppLogState from 'renderer/hooks/useAppLogState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { addFFmpegQueue } from 'renderer/lib/queueUtil';
import { number } from 'renderer/utils';

const path = require('path');

const { LOG_LEVEL } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useFFmpegAdd(job) {
  const { jobId } = job;
  const { setAppLogState } = useAppLogState();
  const {
    updateJobTask,
    updateJobStatusState,
    updateJobPidState,
    updateJobProgressState,
  } = useJobItemState(job);
  const addFFmpegItem = React.useCallback(
    (task) => {
      const { inFile, outFile } = task;
      const shortInFile = path.basename(inFile);
      const shortOutFile = path.basename(outFile);
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addFFmpegQueue(task, job);
      console.log('%%%%%% worker:', worker)
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        // eslint-disable-next-line prettier/prettier
        const activeTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.ACTIVE});
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_ITEM_STATUS.PROGRESS, (progressObj) => {
        const { frame, total_size, speed, out_time, drop_frames } = progressObj;
        updateJobProgressState({
          outFileSize: number.niceBytes(total_size),
          speed,
          outTime: out_time.slice(0,-3),
          percent: number.nicePercent(frame, task.totalFrames),
        });
      });
      worker.on('spawn', (pid) => {
        // console.log('in pid, jobId=', job.jobId);
        updateJobPidState(pid)
      });
      worker.on(Q_ITEM_STATUS.COMPLETED, (result) => {
        console.log(result);
        const logMessage = `Transcoding ${shortInFile} ---> ${shortOutFile} done.`;
        setAppLogState(logMessage);
        // eslint-disable-next-line prettier/prettier
        const completedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.COMPLETED})
        const nextInFile = outFile;
        const updatedTask = getNextTaskUpdated({ inFile: nextInFile });
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
        updateJobProgressState({
          percent: '100%',
        })
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        // eslint-disable-next-line prettier/prettier
        const failedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.FAILED});
        updateJobTask([failedTask]);
        const logMessage = `Transcoding ${shortInFile} ---> ${shortOutFile} failed.`;
        setAppLogState(logMessage, LOG_LEVEL.ERROR);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [
      job,
      updateJobTask,
      updateJobStatusState,
      updateJobProgressState,
      updateJobPidState,
      setAppLogState,
    ]
  );
  return {
    addFFmpegItem,
  };
}
