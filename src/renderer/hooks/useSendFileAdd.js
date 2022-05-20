/* eslint-disable import/named */
import React from 'react';
import { useSelector } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import { addSendFileQueue } from 'renderer/lib/queueUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import bullConstants from 'renderer/config/bull-constants';
import { number } from 'renderer/utils';

const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useSendFileAdd(job) {
  const { jobId } = job;
  const startTimeRef = React.useRef(null);
  const { updateJobTask, updateJobStatusState, updateJobProgressState } = useJobItemState(job);
  // console.log('&&&&&&&&&&&&&', startTime);
  const addSendFileItem = React.useCallback(
    (task) => {
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addSendFileQueue(task, job);
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        // eslint-disable-next-line prettier/prettier
        const activeTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.ACTIVE});
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
        startTimeRef.current = Date.now();
      });
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { inFile } = result;
        // eslint-disable-next-line prettier/prettier
        const completedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.COMPLETED});
        if (nextTask === undefined) {
          updateJobTask([completedTask]);
          updateJobStatusState(JOB_STATUS.COMPLETED);
          return;
        };
        const updatedTask = getNextTaskUpdated({ inFile, });
        // console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_ITEM_STATUS.PROGRESS, (progressObj) => {
        const { totalSize, sent } = progressObj;
        const elapsed = Date.now() - startTimeRef.current;
        console.log('&&&&', startTimeRef.current, elapsed)
        updateJobProgressState({
          percent: number.nicePercent(sent, totalSize),
          speed: number.niceSpeed(sent, elapsed),
        })
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        // eslint-disable-next-line prettier/prettier
        const failedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.FAILED});
        updateJobTask([failedTask]);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [
      job,
      startTimeRef,
      updateJobProgressState,
      updateJobStatusState,
      updateJobTask,
    ]
  );

  return {
    addSendFileItem,
  };
};
