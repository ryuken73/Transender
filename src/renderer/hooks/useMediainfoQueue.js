/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
} from 'renderer/lib/queueUtil';

const { file } = require('renderer/utils');
const { changeDir, changeExtension } = file;

const { LOG_LEVEL, FFMPEG_OPTIONS } = constants;
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

export default function useMediainfoQueue(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { updateJobTask, updateJobStatusState } = useJobItemState(jobId);
  const startMediainfoQueue = React.useCallback(() => {
    try {
      mediainfoQueue.process(3, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const ret = await mediaInfo.run(qItemBody.inputFile);
          const isMediaFile = mediaInfo.isMediaFile();
          console.log('###', mediaInfo.getResult())
          if (isMediaFile) {
            dispatch(
              setAppLog({ message: `Aanlyze ${qItemBody.inputFile} done.` })
            );
            done(null, {
              isMediaFile,
              rawResult: mediaInfo.getResult(),
              video: mediaInfo.getStreams('Video'),
              audio: mediaInfo.getStreams('Audio'),
            });
          } else {
            dispatch(
              setAppLog({
                level: LOG_LEVEL.ERROR,
                message: `Aanlyze ${qItemBody.inputFile} Failed.[not-media-file]`,
              })
            )
            done('codec unknows. suspect not media file.')
          }
        } catch(err){
          console.log('errored:', err);
          done(err)
        }
      })
    } catch (err) {
      throw new Error(err);
      // console.log(err);
    }
    return mediainfoQueue;
  });

  const addMediainfoItem = React.useCallback(
    (task) => {
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addMediainfoQueue(task, job);
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

  return {
    startMediainfoQueue,
    addMediainfoItem,
  };
}
