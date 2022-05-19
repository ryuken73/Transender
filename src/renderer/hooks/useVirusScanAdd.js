/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
import React from 'react';
import { useSelector } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import bullConstants from 'renderer/config/bull-constants';
import { addVirusScanQueue } from 'renderer/lib/queueUtil';

const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useVirusScanAdd(job) {
  const { jobId } = job;
  const { updateJobTask, updateJobStatusState } = useJobItemState(job);
  const addVirusScanItem = React.useCallback(
    (task) => {
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addVirusScanQueue(task, job);
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        // eslint-disable-next-line prettier/prettier
        const activeTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.ACTIVE});
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { inFile } = result;
        console.log('##### task success!:');
        // eslint-disable-next-line prettier/prettier
        const completedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.COMPLETED});
        const updatedTask = getNextTaskUpdated({
          inFile,
        });
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

  return {
    addVirusScanItem,
  };
}
