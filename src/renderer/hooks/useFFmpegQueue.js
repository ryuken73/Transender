/* eslint-disable import/named */
import React from 'react';
import { useSelector } from 'react-redux';
import { getTask, getNextTask, taskStatusUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useAppState from 'renderer/hooks/useAppState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { ffmpegQueue, addFFmpegQueue } from 'renderer/lib/queueUtil';
import ffmpegProc from 'renderer/lib/ffmpegProc';
import { number } from 'renderer/utils';
import { getAbsolutePath } from 'renderer/lib/electronUtil';

const path = require('path');
const ffmpegBinary = getAbsolutePath('bin/ffmpeg2018.exe', true);

const { LOG_LEVEL } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useFFmpegQueue(jobId) {
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { setAppLogState } = useAppState();
  const {
    updateJobTask,
    updateJobStatusState,
    updateJobFileSizeState,
    updateJobPercentState,
    updateJobOutTimeState,
    updateJobSpeedState,
    updateJobPidState,
  } = useJobItemState(jobId);
  const startFFmpegQueue = React.useCallback(() => {
    try {
      ffmpegQueue.process(2, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const { inFile, ffmpegOptions, outFile, totalFrames } = qItemBody;
          const ffmpeg = ffmpegProc(ffmpegBinary);
          const childProcess = ffmpeg.run({
            inFile,
            ffmpegOptions,
            outFile,
            totalFrames
          });
          childProcess.on('done', (code) => {
            if (code === 0) {
              done(null, 'ffmpeg success');
              qItem.emit(Q_WORKER_EVENTS.COMPLETED);
            } else {
              done('ffmpeg failed');
              qItem.emit(Q_WORKER_EVENTS.FAILED);
            }
          });
          childProcess.on('spawn', () => {
            qItem.emit('spawn', childProcess.pid);
          })
          childProcess.on('error', (error) => {
            done(error);
            qItem.emit(Q_WORKER_EVENTS.FAILED, error);
          });
          childProcess.on('progress', (progressObj) => {
            qItem.emit('progress', progressObj);
          });
        } catch (err) {
          console.log('errored:', err);
          done(err);
        }
      });
    } catch (err) {
      throw new Error(err);
      // console.log(err);
    }
    return ffmpegQueue;
  });
  const makeFFmpegOptions = (video, audio) => {
    return '-y -acodec copy -progress pipe:1';
  };
  const makeFFmpegOutPath = () => {
    return 'd:/temp/aaa.mp4';
  };
  const addFFmpegItem = React.useCallback(
    (task) => {
      const { inFile, outFile } = task;
      const shortInFile = path.basename(inFile);
      const shortOutFile = path.basename(outFile);
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskStatusUpdater(currentTask);
      const worker = addFFmpegQueue(task, job);
      console.log('%%%%%% worker:', worker)
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        const activeTask = getCurrentTaskUpdated(Q_ITEM_STATUS.ACTIVE);
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_ITEM_STATUS.PROGRESS, (progressObj) => {
        const { frame, total_size, speed, out_time, drop_frames } = progressObj;
        updateJobFileSizeState(number.niceBytes(total_size));
        updateJobSpeedState(speed);
        updateJobOutTimeState(out_time.slice(0, -3));
        updateJobPercentState(number.nicePercent(frame, task.totalFrames));
      });
      worker.on('spawn', (pid) => {
        // console.log('in pid, jobId=', job.jobId);
        updateJobPidState(pid)
      });
      worker.on(Q_ITEM_STATUS.COMPLETED, (result) => {
        console.log(result);
        const logMessage = `Transcoding ${shortInFile} ---> ${shortOutFile} done.`;
        setAppLogState(logMessage);
        const completedTask = getCurrentTaskUpdated(Q_ITEM_STATUS.COMPLETED)
        const nextInFile = outFile;
        const updatedTask = {
          ...nextTask,
          inFile: nextInFile,
        };
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
        updateJobPercentState('100%');
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        const failedTask = getCurrentTaskUpdated(Q_ITEM_STATUS.FAILED);
        updateJobTask([failedTask]);
        const logMessage = `Transcoding ${shortInFile} ---> ${shortOutFile} faild.`;
        setAppLogState(logMessage, LOG_LEVEL.ERROR);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [
      job,
      updateJobFileSizeState,
      updateJobPidState,
      updateJobStatusState,
      updateJobPercentState,
      updateJobTask,
      setAppLogState
    ]
  );

  return {
    startFFmpegQueue,
    addFFmpegItem,
  };
}
