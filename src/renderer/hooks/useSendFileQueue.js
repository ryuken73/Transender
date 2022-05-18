/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import { number } from 'renderer/utils';
import {
  sendFile,
  sendFileQueue,
  addSendFileQueue,
} from 'renderer/lib/queueUtil';

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
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { updateJobTask, updateJobStatusState, updateJobPercentState } = useJobItemState(jobId);
  const startSendFileQueue = React.useCallback(() => {
    try {
      sendFileQueue.process(1, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const outFile = mkOutFile(qItemBody.inFile);
          console.log('^^ outFile:', outFile)
          const worker = sendFile.run({
            inFile: qItemBody.inFile,
            hostname: SEND_HOSTNAME,
            port: SEND_PORT,
            // path: path.join(SEND_URI_PATH, outFile),
            path: `${SEND_URI_PATH}/${outFile}`,
           });
          worker.on('done', () => {
            // dispatch(
            //   setAppLog({ message: `send file ${qItemBody.inFile} done.`});
            // );
            done(null, {
              inFile: qItemBody.inFile,
            });
          });
          worker.on('error', (error) => {
            dispatch(
              setAppLog({
                level: LOG_LEVEL.ERROR,
                message: `sendFile error [${qItemBody.inFile}]`,
              })
            )
            done('unexpected error')
          });
          worker.on('progress', (progressObj) => {
            console.log('@@@@@ progress:', progressObj);
            qItem.emit('progress', progressObj);
          })
        } catch(err){
          console.log('errored:', err);
          done(err)
        }
      })
    } catch (err) {
      throw new Error(err);
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
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_ITEM_STATUS.PROGRESS, (progressObj) => {
        const { totalSize, sent } = progressObj;
        // updateJobSpeedState(speed);
        updateJobPercentState(number.nicePercent(sent, totalSize));
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
    startSendFileQueue,
    addSendFileItem,
  };
}
