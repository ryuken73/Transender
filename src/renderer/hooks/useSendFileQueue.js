/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTask,
  getNextTask,
  taskUpdater,
  clearWorker,
} from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import { sendFileQueue, addSendFileQueue } from 'renderer/lib/queueUtil';
import sendFileProc from 'renderer/lib/sendFileProc';
import { number } from 'renderer/utils';

const path = require('path');
const { LOG_LEVEL, SEND_HOSTNAME, SEND_PORT, SEND_URI_PATH } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

const mkOutFile = inFile => {
  const inBasename = path.basename(inFile);
  const inExt = path.extname(inBasename);
  const outNoExt = inBasename.replace(inExt, `_${Date.now()}`);
  return `${outNoExt}${inExt}`;
}

export default function useSendFileQueue(jobId) {
  const [workers, setWorkers] = React.useState({});
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { updateJobTask, updateJobStatusState, updateJobProgressState } = useJobItemState(jobId);
  const startSendFileQueue = React.useCallback(() => {
    try {
      sendFileQueue.process(3, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const { jobId, inFile } = qItemBody;
          const outFile = mkOutFile(qItemBody.inFile);
          console.log('^^ outFile:', outFile);
          const sendFile = sendFileProc();
          const worker = sendFile.run({
            inFile,
            hostname: SEND_HOSTNAME,
            port: SEND_PORT,
            path: `${SEND_URI_PATH}/${outFile}`,
           });
          // eslint-disable-next-line @typescript-eslint/no-shadow
          setWorkers((workers) => {
            return {
              ...workers,
              [jobId]: sendFile,
            }
          });
          worker.on('done', () => {
            clearWorker(jobId, setWorkers);
            done(null, {
              inFile: qItemBody.inFile,
            });
          });
          worker.on('error', (error) => {
            clearWorker(jobId, setWorkers);
            done(error);
          });
          worker.on('progress', (progressObj) => {
            // console.log('@@@@@ progress:', progressObj);
            qItem.emit('progress', progressObj);
          })
        } catch (error) {
          clearWorker(jobId, setWorkers);
          console.log('errored:', error);
          done(error)
        }
      })
    } catch (error) {
      throw new Error(error);
      // console.log(err);
    }
    return sendFileQueue;
  });

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
        updateJobProgressState({
          percent: number.nicePercent(sent, totalSize),
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
    [job, updateJobProgressState, updateJobStatusState, updateJobTask]
  );

  return {
    workers,
    startSendFileQueue,
    addSendFileItem,
  };
}
