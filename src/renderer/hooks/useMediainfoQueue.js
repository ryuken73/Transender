/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getNextTask } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
} from 'renderer/lib/queueUtil';

const { LOG_LEVEL } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

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
                message: `Aanlyze ${qItemBody.inputFile} Faild.[not-media-file]`,
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
  const makeFFmpegOptions = (video, audio) => {
    return '-y -acodec copy -progress pipe:1';
  };
  const makeFFmpegOutPath = () => {
    return 'd:/temp/aaa.mp4';
  };
  const addMediainfoItem = React.useCallback(
    (task) => {
      const worker = addMediainfoQueue(task, job);
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { rawResult, video, audio } = result;
        const currentTask = getTask(job, task);
        const completedTask = {
          ...currentTask,
          status: Q_ITEM_STATUS.COMPLETED
        }
        // updateJobTask(statusChanged);
        console.log('&&&&', video('FrameCount'));
        const ffmpegOptions = makeFFmpegOptions(video, audio);
        const totalFrames = video('FrameCount')[0];
        const outFile = makeFFmpegOutPath();
        const nextTask = getNextTask(job, task);
        const updatedTask = {
          ...nextTask,
          inFile: job.sourceFile.fullName,
          ffmpegOptions,
          totalFrames,
          outFile,
        };
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error)
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
