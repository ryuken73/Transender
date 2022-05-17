/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getNextTask } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import { ffmpegQueue, addFFmpegQueue } from 'renderer/lib/queueUtil';
import ffmpegProc from 'renderer/lib/ffmpegProc';
import { number } from 'renderer/utils';
import { getAbsolutePath } from 'renderer/lib/electronUtil';

const ffmpegBinary = getAbsolutePath('bin/ffmpeg2018.exe', true);

const { LOG_LEVEL } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useFFmpegQueue(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const {
    updateJobTask,
    updateJobStatusState,
    updateJobFileSizeState,
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
          childProcess.on('exit', (code) => {
            if (code === 0) {
              dispatch(
                setAppLog({
                  message: `Transcoding ${inFile} ---> ${outFile} done.`,
                })
              );
              done(null, 'ffmpeg success');
            } else {
              dispatch(
                setAppLog({
                  level: LOG_LEVEL.ERROR,
                  message: `Transcoding ${inFile} ---> ${outFile} failed!.`,
                })
              );
              done('ffmpeg failed');
            }
          });
          childProcess.on('spawn', () => {
            qItem.emit('spawn', childProcess.pid);
          })
          childProcess.on('error', (error) => {
            done(error);
          });
          childProcess.on('progress', (progressObj) => {
            // console.log('$$$$$ pid', childProcess.pid, progressObj);
            qItem.emit('progress', progressObj);
          });
          // childProcess.on('progress', (progressObj) => {
          //   qItem.emit('progress', progressObj);
          // });
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
      const worker = addFFmpegQueue(task, job);
      console.log('%%%%%% worker:', worker)
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_ITEM_STATUS.PROGRESS, (progressObj) => {
        const { total_size, speed, out_time, drop_frames } = progressObj;
        updateJobFileSizeState(number.niceBytes(total_size));
      });
      worker.on('spawn', (pid) => {
        // console.log('in pid, jobId=', job.jobId);
        updateJobPidState(pid)
      });
      worker.on(Q_ITEM_STATUS.COMPLETED, (result) => {
        console.log(result);
        const currentTask = getTask(job, task);
        const completedTask = {
          ...currentTask,
          status: Q_ITEM_STATUS.COMPLETED
        }
        // const ffmpegOptions = makeFFmpegOptions(video, audio);
        // const totalFrames = video('Count')[0];
        const inFile = task.outFile;
        const nextTask = getNextTask(job, task);
        const updatedTask = {
          ...nextTask,
          inFile,
        };
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [
      job,
      updateJobFileSizeState,
      updateJobPidState,
      updateJobStatusState,
      updateJobTask,
    ]
  );

  return {
    startFFmpegQueue,
    addFFmpegItem,
  };
}
